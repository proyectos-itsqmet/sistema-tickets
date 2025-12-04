import { type ColumnDef } from "@tanstack/react-table";
import type { RatesInterface } from "@/interfaces/rates.interface";
import { formatDateTime } from "../parking/parking.utils";
import { DisableRateButton } from "./DisableRateButton";

export const createRatesColumns = (
  onDisableRate: (rateId: number, newTarifa: number) => Promise<void>,
  loading: boolean
): ColumnDef<RatesInterface>[] => [
  {
    accessorKey: "created_at",
    header: "Fecha de creación",
    cell: ({ row }) => {
      const fecha = row.getValue("created_at") as string;
      return <div>{formatDateTime(fecha)}</div>;
    },
  },
  {
    id: "tarifa_por_hora",
    header: "Tarifa",
    cell: ({ row }) => {
      const tarifa = row.original.tarifa_por_hora;
      return <div className="capitalize">${tarifa.toFixed(2)}</div>;
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
        <DisableRateButton
          rate={row.original}
          onDisableRate={onDisableRate}
          loading={loading}
        />
      );
    },
  },
];
