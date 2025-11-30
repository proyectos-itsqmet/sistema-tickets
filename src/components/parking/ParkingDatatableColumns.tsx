import { type ColumnDef } from "@tanstack/react-table";
import type { TicketsInterface } from "@/interfaces/tickets.interface";
import { SalidaButton } from "./SalidaButton";
import { formatDateTime, calculateElapsedTime } from "./parking.utils";

// Re-exportar las funciones de utilidad para mantener compatibilidad
export {
  calculateElapsedTime,
  calculateAmount,
  calculateHours,
} from "./parking.utils";

export const createColumns = (
  onConfirmSalida: (
    ticket: TicketsInterface,
    metodoPago: string
  ) => Promise<void>,
  loading: boolean
): ColumnDef<TicketsInterface>[] => [
  {
    accessorKey: "placa_vehiculo",
    header: "Placa",
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("placa_vehiculo")}</div>
    ),
  },
  {
    accessorKey: "fecha_hora_ingreso",
    header: "Fecha de Ingreso",
    cell: ({ row }) => {
      const fecha = row.getValue("fecha_hora_ingreso") as string;
      return <div>{formatDateTime(fecha)}</div>;
    },
  },
  {
    accessorKey: "fecha_hora_salida",
    header: "Fecha de Salida",
    cell: ({ row }) => {
      const fecha = row.getValue("fecha_hora_salida") as string | null;
      return <div>{formatDateTime(fecha)}</div>;
    },
  },
  {
    accessorKey: "fecha_hora_ingreso",
    id: "tiempoEstacionado",
    header: "Tiempo",
    cell: ({ row }) => {
      const fechaIngreso = row.getValue("fecha_hora_ingreso") as string;
      return (
        <div className="font-medium text-green-500">
          {calculateElapsedTime(fechaIngreso)}
        </div>
      );
    },
  },
  {
    accessorKey: "monto",
    header: "Valor",
    cell: ({ row }) => {
      const valor = row.getValue("monto") as number | null;
      return (
        <div className="font-medium">
          {valor ? `$${valor.toFixed(2)}` : "Pendiente"}
        </div>
      );
    },
  },
  {
    id: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const salida = row.original.fecha_hora_salida;
      return (
        <div className="capitalize">{salida ? "Finalizado" : "Activo"}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <SalidaButton
          ticket={row.original}
          onConfirmSalida={onConfirmSalida}
          loading={loading}
        />
      );
    },
  },
];
