import { type ColumnDef } from "@tanstack/react-table";

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
import { LogOut } from "lucide-react";
import type { TicketsInterface } from "@/interfaces/tickets.interface";
import { Separator } from "@/components/ui/separator";

//! Función para formatear fecha ignorando la zona horaria
const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return "N/A";

  const cleanDateString = dateString.replace("Z", "");
  const date = new Date(cleanDateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

//! Función para calcular el tiempo transcurrido (formato legible)
const calculateElapsedTime = (fechaIngreso: string | null): string => {
  if (!fechaIngreso) return "N/A";

  const cleanDateString = fechaIngreso.replace("Z", "");
  const ingreso = new Date(cleanDateString);
  const ahora = new Date();

  const diferenciaMilisegundos = ahora.getTime() - ingreso.getTime();
  const minutosTotales = Math.floor(diferenciaMilisegundos / (1000 * 60));
  const horasTotales = Math.floor(minutosTotales / 60);
  const dias = Math.floor(horasTotales / 24);

  const horas = horasTotales % 24;
  const minutos = minutosTotales % 60;

  if (dias > 0) {
    return `${dias}d ${horas}h ${minutos}m`;
  } else if (horas > 0) {
    return `${horas}h ${minutos}m`;
  } else {
    return `${minutos}m`;
  }
};

//! Función para calcular las horas transcurridas (para el cálculo del monto)
const calculateHours = (fechaIngreso: string | null): number => {
  if (!fechaIngreso) return 0;

  const cleanDateString = fechaIngreso.replace("Z", "");
  const ingreso = new Date(cleanDateString);
  const ahora = new Date();

  const diferenciaMilisegundos = ahora.getTime() - ingreso.getTime();

  //! Convertir a horas (decimales)
  const horasTranscurridas = diferenciaMilisegundos / (1000 * 60 * 60);

  //! Redondear hacia arriba (cobrar hora completa)
  return Math.ceil(horasTranscurridas);
};

//! Función para calcular el monto a pagar
const calculateAmount = (
  fechaIngreso: string | null,
  tarifaPorHora: number
): number => {
  if (!fechaIngreso || !tarifaPorHora) return 0;

  const horasACobrar = calculateHours(fechaIngreso);
  return horasACobrar * tarifaPorHora;
};

export const columns: ColumnDef<TicketsInterface>[] = [
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
      const placa = row.original.placa_vehiculo;
      const ingreso = row.original.fecha_hora_ingreso;
      const tarifa = row.original.tarifa || 0.5;

      const horasEstacionado = calculateHours(ingreso);
      const montoTotal = calculateAmount(ingreso, tarifa);

      return (
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger className="bg-red-500 hover:bg-red-400 gap-4 cursor-pointer text-white px-4 py-2 rounded-md flex items-center">
              <LogOut className="h-4 w-4" /> Salida
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex gap-2 items-center">
                  <LogOut className="text-red-500" /> Confirmar Salida
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="flex flex-col gap-4">
                    <span>
                      ¿Desea registrar la salida del siguiente vehículo?
                    </span>
                    <div className="flex flex-col bg-gray-50 border rounded-md gap-4 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Placa:</span>
                        <span className="text-black font-semibold uppercase">
                          {placa}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          Fecha y hora de ingreso:
                        </span>
                        <span className="text-black font-semibold">
                          {formatDateTime(ingreso)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          Tiempo estacionado:
                        </span>
                        <span className="text-cyan-700 font-semibold">
                          {calculateElapsedTime(ingreso)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Horas a cobrar:</span>
                        <span className="text-black font-semibold">
                          {horasEstacionado}{" "}
                          {horasEstacionado === 1 ? "hora" : "horas"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tarifa por hora:</span>
                        <span className="text-black font-semibold">
                          ${tarifa.toFixed(2)}
                        </span>
                      </div>

                      <Separator className="my-2 bg-gray-300" />

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-semibold text-lg">
                          Total a pagar:
                        </span>
                        <span className="text-cyan-700 text-2xl font-bold">
                          ${montoTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-400 cursor-pointer">
                  Confirmar salida
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
