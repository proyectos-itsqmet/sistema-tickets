import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { hashPassword } from "@/lib/password";
import { useUser } from "@/hooks/useUser";
import { useRoles } from "@/hooks/useRoles";
import type { RolInterface } from "@/interfaces/rol.interface";
import type { UserInterface } from "@/interfaces/user.interface";

export const RegisterForm = () => {
  const [rol, setRol] = useState<RolInterface | null>(null);
  const [roles, setRoles] = useState<RolInterface[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    createUser,
    getLastUserId,
    loading: loadingUser,
    error: errorUser,
  } = useUser();
  const { getRoles, loading: loadingRoles } = useRoles();

  useEffect(() => {
    //! Obtener roles al cargar el componente
    const fetchRoles = async () => {
      const rolesData = await getRoles();
      setRoles(rolesData);
    };

    fetchRoles();
  }, [getRoles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!rol) {
      setError("Debe seleccionar un rol");
      return;
    }

    try {
      //! Encriptar la contraseña
      const hashedPassword = await hashPassword(formData.password);

      const id = await getLastUserId();

      console.log("Last user ID:", id);

      //! Crear usuario
      const newUser: UserInterface = {
        id: id !== null ? id + 1 : 1,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: hashedPassword,
        role: rol.id,
        status: true,
        created_at: new Date().toISOString(),
        loginAttempts: 0,
      };

      const result = await createUser(newUser);

      if (result) {
        setSuccess("Usuario registrado exitosamente");

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        });
        setRol(null);
      } else {
        setError(errorUser || "Error al registrar el usuario");
      }
    } catch (err) {
      setError("Error al procesar el registro");
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-sm xl:max-w-md">
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@correo.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rol">Rol</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={loadingRoles}
                  >
                    {loadingRoles
                      ? "Cargando roles..."
                      : rol != null
                      ? rol.name
                      : "Seleccione un rol"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                  <DropdownMenuRadioGroup
                    value={rol != null ? rol.name : ""}
                    onValueChange={(value) => {
                      const selectedRol = roles.find(
                        (item) => item.name === value
                      );
                      if (selectedRol) setRol(selectedRol);
                    }}
                  >
                    {roles.map((item) => (
                      <DropdownMenuRadioItem key={item.id} value={item.name}>
                        {item.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardFooter className="flex-col gap-6 px-0 pt-6">
            {error && (
              <div className="text-destructive text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-600 text-sm text-center">
                {success}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loadingUser || loadingRoles}
            >
              {loadingUser ? "Registrando..." : "Registrar"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};
