import { type ColumnDef } from "@tanstack/react-table";
import type { UserInterface } from "@/interfaces/user.interface";
import { ToggleUserStatusButton } from "./ToggleUserStatusButton";

interface CreateUsersColumnsOptions {
  onToggleStatus: (userId: number, newStatus: boolean) => Promise<void>;
  loading: boolean;
}

export const createUsersColumns = ({
  onToggleStatus,
  loading,
}: CreateUsersColumnsOptions): ColumnDef<UserInterface>[] => [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <div>{id}</div>;
    },
  },
  {
    accessorKey: "firstName",
    header: "Nombre",
    cell: ({ row }) => {
      const nombre = row.getValue("firstName") as string;
      return <div>{nombre}</div>;
    },
  },
  {
    id: "lastName",
    header: "Apellido",
    cell: ({ row }) => {
      const apellido = row.original.lastName;
      return <div className="capitalize">{apellido}</div>;
    },
  },
  {
    id: "role",
    header: "Rol",
    cell: ({ row }) => {
      const rol = row.original.role;
      return (
        <div className="capitalize">
          {rol === 1 ? "Administrador" : "Operador"}
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div
          className={`capitalize font-medium ${
            status ? "text-green-600" : "text-gray-400"
          }`}
        >
          {status ? "Activo" : "Deshabilitado"}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <ToggleUserStatusButton
          user={row.original}
          onToggleStatus={onToggleStatus}
          loading={loading}
        />
      );
    },
  },
];
