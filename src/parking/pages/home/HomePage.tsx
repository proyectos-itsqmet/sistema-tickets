import { ParkingDatatable } from "@/components/parking/ParkingDatatable";
import {
  calculateElapsedTime,
  calculateAmount,
} from "@/components/parking/ParkingDatatableColumns";
import { useTickets } from "@/hooks/useTickets";
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
import { toast } from "sonner";

export const HomePage = () => {
  const {
    getTicketsByFechaSalida,
    getTickets,
    createTicket,
    updatedTicket,
    loading,
  } = useTickets();
  const [data, setData] = useState<TicketsInterface[]>([]);
  const [vehiculosEstacionados, setVehiculosEstacionados] = useState(0);
  const [ingresosHoy, setIngresosHoy] = useState(0);
  const [salidasHoy, setSalidasHoy] = useState(0);
  const [placa, setPlaca] = useState("");
  const [placaError, setPlacaError] = useState("");
  const [openModal, setOpenModal] = useState(false);

  //! Validar formato de placa: 'ABC-1234'
  const validarPlaca = (valor: string): boolean => {
    const regex = /^[A-Za-z]{3}-\d{4}$/;
    return regex.test(valor);
  };

  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.toUpperCase();

    if (valor.length === 3 && !valor.includes("-")) {
      valor = valor + "-";
    }

    //!Limitar 8 caracteres
    if (valor.length <= 8) {
      setPlaca(valor);

      //! Validar solo si tiene contenido
      if (valor.length > 0 && valor.length < 8) {
        setPlacaError("Formato: ABC-1234");
      } else if (valor.length === 8 && !validarPlaca(valor)) {
        setPlacaError("Formato inválido. Use: ABC-1234");
      } else {
        setPlacaError("");
      }
    }
  };

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

  const fetchData = async () => {
    //! Obtener tickets sin salida
    const ticketsData = await getTicketsByFechaSalida();
    setData(ticketsData);

    //! Obtener estadísticas
    const allTickets = await getTickets();

    //! Vehículos actualmente estacionados (sin fecha de salida)
    const estacionados = allTickets.filter(
      (ticket) => ticket.fecha_hora_salida === null
    ).length;
    setVehiculosEstacionados(estacionados);

    //! Ingresados hoy (que ingresaron hoy y aún no han salido)
    const ingresos = allTickets.filter(
      (ticket) =>
        isToday(ticket.fecha_hora_ingreso) && ticket.fecha_hora_salida === null
    ).length;
    setIngresosHoy(ingresos);

    //! Salidas hoy (que salieron en el día de hoy)
    const salidas = allTickets.filter((ticket) =>
      isToday(ticket.fecha_hora_salida)
    ).length;
    setSalidasHoy(salidas);
  };

  useEffect(() => {
    const loadData = async () => {
      //! Obtener tickets sin salida
      const ticketsData = await getTicketsByFechaSalida();
      setData(ticketsData);

      //! Obtener estadísticas
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

    loadData();
  }, [getTicketsByFechaSalida, getTickets]);

  const handleRegistrarIngreso = async () => {
    if (!placa.trim()) {
      toast.error("Error", {
        description: "Debe ingresar la placa del vehículo",
      });
      return;
    }

    if (!validarPlaca(placa)) {
      toast.error("Error", {
        description: "Formato de placa inválido. Use: ABC-1234",
      });
      return;
    }

    const result = await createTicket({
      placa_vehiculo: placa.toUpperCase(),
      id_operador_ingreso: 1,
      tarifa: 1,
    });

    if (result) {
      toast.success("Ingreso registrado", {
        description: `Vehículo ${placa.toUpperCase()} registrado exitosamente`,
      });
      setPlaca("");
      setPlacaError("");
      setOpenModal(false);
      await fetchData();
    } else {
      toast.error("Error", {
        description: "No se pudo registrar el ingreso del vehículo",
      });
    }
  };

  const handleConfirmSalida = async (
    ticket: TicketsInterface,
    metodoPago: string
  ) => {
    const tiempoPermanencia = calculateElapsedTime(ticket.fecha_hora_ingreso);
    const tarifa = ticket.tarifa || 0.5;
    const monto = calculateAmount(ticket.fecha_hora_ingreso, tarifa);

    const result = await updatedTicket({
      ticket,
      id_operador_salida: 1, // TODO: Obtener del usuario autenticado
      tiempo_permanencia: tiempoPermanencia,
      monto,
      metodo_pago: metodoPago,
    });

    if (result) {
      toast.success("Salida registrada", {
        description: `Vehículo ${ticket.placa_vehiculo.toUpperCase()} - Total: $${monto.toFixed(
          2
        )}`,
      });
      await fetchData();
    } else {
      toast.error("Error", {
        description: "No se pudo registrar la salida del vehículo",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:justify-between md:items-center gap-4 px-2">
        <div className="flex flex-col items-start justify-center">
          <h3 className="text-xl font-semibold">Ingreso / Salida </h3>
          <span className="text-sm text-gray-400">
            Gestión de entrada y salida de vehículos
          </span>
        </div>

        <AlertDialog
          open={openModal}
          onOpenChange={(open) => {
            setOpenModal(open);
            if (!open) {
              setPlaca("");
              setPlacaError("");
            }
          }}
        >
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
                      <Input
                        value={placa}
                        onChange={handlePlacaChange}
                        placeholder="Ej: ABC-1234"
                        className={placaError ? "border-red-500" : ""}
                      />
                      {placaError && (
                        <span className="text-red-500 text-sm">
                          {placaError}
                        </span>
                      )}
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
                className="bg-emerald-500 hover:bg-emerald-400 cursor-pointer"
                onClick={handleRegistrarIngreso}
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrar"}
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
          <ParkingDatatable
            data={data}
            onConfirmSalida={handleConfirmSalida}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};
