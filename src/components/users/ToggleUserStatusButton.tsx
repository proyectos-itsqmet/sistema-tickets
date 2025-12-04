import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { UserInterface } from "@/interfaces/user.interface";

interface ToggleUserStatusButtonProps {
  user: UserInterface;
  onToggleStatus: (userId: number, newStatus: boolean) => Promise<void>;
  loading: boolean;
}

export const ToggleUserStatusButton = ({
  user,
  onToggleStatus,
  loading,
}: ToggleUserStatusButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    await onToggleStatus(user.id, !user.status);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className="flex justify-end">
          <Button
            className={`cursor-pointer ${
              user.status
                ? "bg-red-500 hover:bg-red-400"
                : "bg-emerald-500 hover:bg-emerald-400"
            }`}
          >
            {user.status ? "Deshabilitar" : "Habilitar"}
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {user.status ? "Deshabilitar usuario" : "Habilitar usuario"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {user.status ? (
              <>
                ¿Está seguro que desea deshabilitar al usuario{" "}
                <strong>
                  {user.firstName} {user.lastName}
                </strong>
                ? El usuario no podrá iniciar sesión hasta que sea habilitado
                nuevamente.
              </>
            ) : (
              <>
                ¿Está seguro que desea habilitar al usuario{" "}
                <strong>
                  {user.firstName} {user.lastName}
                </strong>
                ? El usuario podrá iniciar sesión nuevamente.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className={`cursor-pointer ${
              user.status
                ? "bg-red-500 hover:bg-red-400"
                : "bg-emerald-500 hover:bg-emerald-400"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={loading}
          >
            {loading
              ? "Procesando..."
              : user.status
              ? "Deshabilitar"
              : "Habilitar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
