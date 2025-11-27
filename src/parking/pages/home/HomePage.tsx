import { ParkingDatatable } from "@/components/parking/ParkingDatatable";
import { useTickets } from "@/hooks/use.tickets";
import type { TicketsInterface } from "@/interfaces/tickets.interface";
import { Car, CircleParking, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";

export const HomePage = () => {
  const { getTicketsByFechaSalida, getTickets } = useTickets();
  const [data, setData] = useState<TicketsInterface[]>([]);
  const [vehiculosEstacionados, setVehiculosEstacionados] = useState(0);
  const [ingresosHoy, setIngresosHoy] = useState(0);
  const [salidasHoy, setSalidasHoy] = useState(0);

  useEffect(() => {
    const isToday = (dateString: string | null): boolean => {
      if (!dateString) return false;

      const date = new Date(dateString);
      const today = new Date();

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };

    //! Obtener tickets al cargar el componente
    const fetchTickets = async () => {
      const ticketsData = await getTicketsByFechaSalida();
      setData(ticketsData);
    };

    //! Obtener estadísticas
    const fetchEstadisticas = async () => {
      const allTickets = await getTickets();

      //! Vehículos actualmente estacionados (sin fecha de salida)
      const estacionados = allTickets.filter(
        (ticket) => ticket.fecha_hora_salida === null
      ).length;
      setVehiculosEstacionados(estacionados);

      //! Ingresados hoy (que ingresaron hoy y aún no han salido)
      const ingresos = allTickets.filter(
        (ticket) =>
          isToday(ticket.fecha_hora_ingreso) &&
          ticket.fecha_hora_salida === null
      ).length;
      setIngresosHoy(ingresos);

      //! Salidas hoy (que salieron en el día de hoy)
      const salidas = allTickets.filter((ticket) =>
        isToday(ticket.fecha_hora_salida)
      ).length;
      setSalidasHoy(salidas);
    };

    fetchTickets();
    fetchEstadisticas();
  }, [getTicketsByFechaSalida, getTickets]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:justify-between md:items-center gap-4 px-2">
        <div className="flex flex-col items-start justify-center">
          <h3 className="text-xl font-semibold">Ingreso / Salida </h3>
          <span className="text-sm text-gray-400">
            Gestión de entrada y salida de vehículos
          </span>
        </div>

        <AlertDialog>
          <AlertDialogTrigger className="bg-emerald-500 hover:bg-emerald-400 gap-4 cursor-pointer text-white px-4 py-2 rounded-md flex items-center">
            <LogOut />
            Registrar ingreso
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex gap-2 items-center">
                <Car className="text-blue-500" /> Registrar ingreso
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="flex flex-col gap-4">
                  <span>
                    Ingrese los datos del vehículo para registrar su ingreso al
                    estacionamiento.
                  </span>
                  <div className="py-6">
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-black">
                        Placa del vehículo
                      </span>
                      <Input />
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction className="bg-emerald-500 hover:bg-emerald-400 cursor-pointer">
                Registrar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex flex-col flex-1 h-full w-full px-2 md:px-4 gap-6">
        <div className="flex flex-col md:flex-row md:col-span-3 w-full gap-6">
          <div className="flex w-full h-20 items-center rounded-2xl border bg-white p-4 gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-cyan-100">
              <CircleParking className="text-cyan-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">
                Vehículos Estacionados
              </span>
              <span className="text-2xl font-semibold">
                {vehiculosEstacionados}
              </span>
            </div>
          </div>
          <div className="flex w-full h-20 items-center rounded-2xl border bg-white p-4 gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-green-100">
              <Car className="text-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Ingresos Hoy</span>
              <span className="text-2xl font-semibold">{ingresosHoy}</span>
            </div>
          </div>
          <div className="flex w-full h-20 items-center rounded-2xl border bg-white p-4 gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-red-100">
              <LogOut className="text-red-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Salidas Hoy</span>
              <span className="text-2xl font-semibold">{salidasHoy}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 w-full h-full rounded-2xl border bg-white p-4">
          <ParkingDatatable data={data} />
        </div>
      </div>
    </div>
  );
};
