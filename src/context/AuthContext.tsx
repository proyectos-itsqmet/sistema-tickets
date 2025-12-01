import { useState, type ReactNode } from "react";
import type { UserInterface } from "@/interfaces/user.interface";
import { AuthContext, type AuthUser } from "./auth.context";

const AUTH_STORAGE_KEY = "auth_user";

//! Obtener usuario inicial desde localStorage
const getInitialUser = (): AuthUser | null => {
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  }
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(getInitialUser);

  const login = (userData: UserInterface) => {
    //! Guardar solo datos necesarios (sin contraseña)
    const authUser: AuthUser = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
    };

    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
