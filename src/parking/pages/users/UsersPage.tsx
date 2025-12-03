import { Button } from "@/components/ui/button";
import { UsersDatatable } from "@/components/users/UsersDatatable";
import { useUser } from "@/hooks/useUser";
import type { UserInterface } from "@/interfaces/user.interface";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RegisterForm } from "@/components/users/RegisterForm";

export const UsersPage = () => {
  const { getUsers, updateUser, loading } = useUser();
  const [data, setData] = useState<UserInterface[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      const users = await getUsers();
      if (isMounted) {
        setData(users);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [getUsers, refreshKey]);

  const handleToggleStatus = useCallback(
    async (userId: number, newStatus: boolean) => {
      const result = await updateUser(userId, {
        status: newStatus,
        loginAttempts: newStatus ? 0 : undefined,
      });

      if (result) {
        toast.success(
          newStatus
            ? "Usuario habilitado correctamente"
            : "Usuario deshabilitado correctamente"
        );
        setRefreshKey((prev) => prev + 1);
      } else {
        toast.error("Error al actualizar el estado del usuario");
      }
    },
    [updateUser]
  );

  const handleRegisterSuccess = () => {
    setOpenRegisterModal(false);
    setRefreshKey((prev) => prev + 1);
    toast.success("Usuario registrado correctamente");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:justify-between md:items-center gap-4 px-2">
        <div className="flex flex-col items-start justify-center">
          <h3 className="text-xl font-semibold">Usuarios</h3>
          <span className="text-sm text-gray-400">
            Control y gestión de usuarios del sistema
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 h-full w-full px-2 gap-6">
        <div className="flex flex-col w-full rounded-2xl border p-4 gap-4">
          <div className="flex items-center justify-end">
            <Dialog
              open={openRegisterModal}
              onOpenChange={setOpenRegisterModal}
            >
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-400 cursor-pointer">
                  Registrar usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Registrar nuevo usuario</DialogTitle>
                </DialogHeader>
                <RegisterForm onSuccess={handleRegisterSuccess} />
              </DialogContent>
            </Dialog>
          </div>
          <UsersDatatable
            data={data}
            loading={loading}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>
    </div>
  );
};
