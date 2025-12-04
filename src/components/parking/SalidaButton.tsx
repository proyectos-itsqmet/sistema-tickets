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

import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";
import type { TicketsInterface } from "@/interfaces/tickets.interface";
import {
  calculateElapsedTime,
  calculateHours,
  calculateAmount,
  formatDateTime,
} from "./parking.utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SalidaButtonProps {
  ticket: TicketsInterface;
  onConfirmSalida: (
    ticket: TicketsInterface,
    metodoPago: string
  ) => Promise<void>;
  loading: boolean;
}

export const SalidaButton = ({
  ticket,
  onConfirmSalida,
  loading,
}: SalidaButtonProps) => {
  const [open, setOpen] = useState(false);
  const [metodoPago, setMetodoPago] = useState("Efectivo");

  const placa = ticket.placa_vehiculo;
  const ingreso = ticket.fecha_hora_ingreso;
  const tarifa = ticket.tarifa || 0.5;
  const isFinalizado = ticket.fecha_hora_salida !== null;

  const horasEstacionado = calculateHours(ingreso);
  const montoTotal = calculateAmount(ingreso, tarifa);

  const handleConfirm = async () => {
    await onConfirmSalida(ticket, metodoPago);
    setOpen(false);
    setMetodoPago("Efectivo");
  };

  return (
    <div className="flex justify-end">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger
          className="bg-red-500 hover:bg-red-400 gap-4 cursor-pointer text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500"
          disabled={isFinalizado}
        >
          <LogOut className="h-4 w-4" /> Salida
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex gap-2 items-center">
              <LogOut className="text-red-500" /> Confirmar Salida
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="flex flex-col gap-4">
                <span>¿Desea registrar la salida del siguiente vehículo?</span>
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
                    <span className="text-gray-600">Tiempo estacionado:</span>
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

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Método de pago:</span>
                    <Select value={metodoPago} onValueChange={setMetodoPago}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Efectivo">Efectivo</SelectItem>
                        <SelectItem value="Tarjeta de débito">
                          Tarjeta de débito
                        </SelectItem>
                        <SelectItem value="Tarjeta de crédito">
                          Tarjeta de crédito
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-400 cursor-pointer"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Confirmar salida"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
