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
import React from "react";

export const RegisterForm = () => {
  const [rol, setRol] = React.useState("Seleccione un rol");

  return (
    <Card className="w-full max-w-sm xl:max-w-md">
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="firstName">Nombre y Apellido</Label>
              <Input id="firstName" type="text" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input id="lastName" type="text" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cedula">Cédula</Label>
              <Input id="cedula" type="text" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@correo.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Rol</Label>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{rol}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                  <DropdownMenuRadioGroup value={rol} onValueChange={setRol}>
                    <DropdownMenuRadioItem value="Administrador">
                      Administrador
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Operador">
                      Operador
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Registrar
        </Button>
      </CardFooter>
    </Card>
  );
};
