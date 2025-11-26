import { useCallback, useState } from "react";

import type { UserInterface } from "@/interfaces/user.interface";
import { env } from "@/configs/env";
import { comparePassword } from "@/lib/password";

const MAX_LOGIN_ATTEMPTS = 3;

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${env.API_URL}/users`;

  //? >>> Obtener usuario por email
  const getUserByEmail = useCallback(
    async (email: string): Promise<UserInterface | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}?email=${email}`);

        if (!response.ok) {
          throw new Error("Error al obtener el usuario");
        }

        const data: UserInterface[] = await response.json();
        return data.length > 0 ? data[0] : null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );
  //? <<<

  //? >>> Actualizar usuario
  const updateUser = useCallback(
    async (
      userId: number,
      updates: Partial<UserInterface>
    ): Promise<UserInterface | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar el usuario");
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );
  //? <<<

  //? >>> Verificar si la cuenta está bloqueada
  const isAccountLocked = (user: UserInterface): boolean => {
    return user.status === false;
  };
  //? <<<

  //? >>> Bloquear cuenta
  const lockAccount = useCallback(
    async (userId: number): Promise<void> => {
      await updateUser(userId, {
        status: false,
        loginAttempts: MAX_LOGIN_ATTEMPTS,
      });
    },
    [updateUser]
  );
  //? <<<

  //? >>> Desbloquear cuenta
  const unlockAccount = async (userId: number): Promise<void> => {
    await updateUser(userId, {
      status: true,
      loginAttempts: 0,
    });
  };
  //? <<<

  //? >>> Crear usuario
  const createUser = useCallback(
    async (user: UserInterface): Promise<UserInterface | null> => {
      setLoading(true);
      setError(null);
      try {
        //! Validar si el email ya esta registrado
        const existingUser = await getUserByEmail(user.email);

        if (existingUser) {
          setError("El email ya está registrado");
          return null;
        }

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          setError("Error al crear el usuario");
          return null;
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, getUserByEmail]
  );
  //? <<<

  //? >>> Iniciar sesion
  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{
      success: boolean;
      user?: UserInterface;
      message?: string;
    }> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}?email=${email}`);

        if (!response.ok) {
          throw new Error("Error al buscar el usuario");
        }

        const users: UserInterface[] = await response.json();

        if (users.length === 0) {
          setError("Usuario no encontrado");
          return { success: false, message: "Usuario no encontrado" };
        }

        const user = users[0];

        //! Verificar si el usuario está inactivo
        if (user.status === false) {
          setError("Tu cuenta está bloqueada. Contacta al administrador.");
          return {
            success: false,
            message: "Tu cuenta está bloqueada. Contacta al administrador.",
          };
        }

        //! Verificar si la cuenta está bloqueada
        if (isAccountLocked(user)) {
          setError(
            "Cuenta bloqueada por múltiples intentos fallidos. Contacta al administrador."
          );
          return {
            success: false,
            message:
              "Cuenta bloqueada por múltiples intentos fallidos. Contacta al administrador.",
          };
        }

        //! Comparar contraseña
        const isValid = await comparePassword(password, user.password);

        if (!isValid) {
          //! Incrementar intentos fallidos
          const newAttempts = (user.loginAttempts || 0) + 1;

          if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
            //! Bloquear cuenta
            await lockAccount(user.id);
            setError(
              "Cuenta bloqueada por múltiples intentos fallidos. Contacta al administrador."
            );
            return {
              success: false,
              message:
                "Cuenta bloqueada por múltiples intentos fallidos. Contacta al administrador.",
            };
          } else {
            //! Actualizar intentos
            await updateUser(user.id, { loginAttempts: newAttempts });
            const remainingAttempts = MAX_LOGIN_ATTEMPTS - newAttempts;

            setError(
              `Contraseña incorrecta. Te quedan ${remainingAttempts} intento(s).`
            );
            return {
              success: false,
              message: `Contraseña incorrecta. Te quedan ${remainingAttempts} intento(s).`,
            };
          }
        }

        //! Resetear intentos
        await updateUser(user.id, { loginAttempts: 0 });

        return { success: true, user };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al iniciar sesión";
        setError(errorMessage);
        console.error(err);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [API_URL, lockAccount, updateUser]
  );
  //? <<<

  //? >>> Obtener el último ID
  const getLastUserId = async (): Promise<number | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}`);

      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }

      const data: UserInterface[] = await response.json();

      if (data.length === 0) {
        return null;
      }

      const maxId = Math.max(...data.map((user) => Number(user.id)));
      return maxId;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  //? <<<

  return {
    loading,
    error,
    getUserByEmail,
    createUser,
    login,
    getLastUserId,
    updateUser,
    isAccountLocked,
    lockAccount,
    unlockAccount,
  };
};
