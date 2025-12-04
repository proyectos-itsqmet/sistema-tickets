import { useCallback, useEffect, useState } from "react";
import { Car, CircleParking, Clock, DollarSign, LogOut } from "lucide-react";
import { useDashboard, type DashboardData } from "@/hooks/useDashboard";

export const DashboardPage = () => {
  const { getDashboardData, loading } = useDashboard();
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchData = useCallback(async () => {
    const result = await getDashboardData();
    if (result) {
      setData(result);
    }
  }, [getDashboardData]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchData();
      }
    };

    loadData();

    // Actualizar cada 30 segundos
    const interval = setInterval(loadData, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchData]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatPercentage = (value: number) => {
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${value}%`;
  };

  const getPercentageColor = (value: number) => {
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-gray-400";
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-400">Cargando dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:justify-between md:items-center gap-4 px-2">
        <div className="flex flex-col items-start justify-center">
          <h3 className="text-xl font-semibold">Dashboard</h3>
          <span className="text-sm text-gray-400">
            Resumen general del sistema de parqueadero
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 h-full w-full px-2 md:px-4 gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-6">
          <div className="flex w-full h-24 items-center justify-between rounded-2xl border bg-white p-4 gap-4">
            <div className="flex flex-col ">
              <span className="text-xs font-semibold text-gray-400">
                Espacios disponibles
              </span>
              <span className="text-2xl font-bold">
                {data?.espaciosDisponibles ?? 0} / {data?.capacidadTotal ?? 0}
              </span>
              <span className="text-xs text-gray-400">espacios totales</span>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-cyan-100">
              <CircleParking className="text-cyan-600" />
            </div>
          </div>
          <div className="flex w-full h-24 items-center justify-between rounded-2xl border bg-white p-4 gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-400">
                Ingresos hoy
              </span>
              <span className="text-2xl font-bold">
                {data?.ingresosHoy ?? 0}
              </span>
              <span
                className={`text-xs ${getPercentageColor(
                  data?.porcentajeCambioIngresos ?? 0
                )}`}
              >
                {formatPercentage(data?.porcentajeCambioIngresos ?? 0)} vs ayer
              </span>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-green-100">
              <Car className="text-green-600" />
            </div>
          </div>
          <div className="flex w-full h-24 items-center justify-between rounded-2xl border bg-white p-4 gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-400">
                Salidas hoy
              </span>
              <span className="text-2xl font-bold">
                {data?.salidasHoy ?? 0}
              </span>
              <span
                className={`text-xs ${getPercentageColor(
                  data?.porcentajeCambioSalidas ?? 0
                )}`}
              >
                {formatPercentage(data?.porcentajeCambioSalidas ?? 0)} vs ayer
              </span>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-red-100">
              <LogOut className="text-red-600" />
            </div>
          </div>
          <div className="flex w-full h-24 items-center justify-between rounded-2xl border bg-white p-4 gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-400">
                Ingresos del día
              </span>
              <span className="text-2xl font-bold">
                ${data?.ingresosDineroHoy ?? 0}
              </span>
              <span
                className={`text-xs ${getPercentageColor(
                  data?.porcentajeCambioDinero ?? 0
                )}`}
              >
                {formatPercentage(data?.porcentajeCambioDinero ?? 0)} vs ayer
              </span>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-100">
              <DollarSign className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full px-2 md:px-4 gap-6">
        <div className="flex flex-col w-full rounded-2xl border p-4 gap-4">
          <div className="flex flex-col ">
            <div className="flex items-center gap-4">
              <Car className="text-blue-400" />
              <span className="text-xl font-semibold">Ocupación Actual</span>
            </div>
            <span className="text-xs text-gray-400">
              Estado de ocupación del estacionamiento
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-2xl font-bold">
              {data?.porcentajeOcupacion ?? 0}%
            </span>
            <div className="rounded-full bg-blue-200 h-4 w-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${data?.porcentajeOcupacion ?? 0}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="w-full flex items-start">
                <div className="flex items-center gap-2">
                  <div className="rounded-full w-4 h-4 bg-blue-500"></div>
                  <span className="text-sm text-gray-400">
                    Ocupados: {data?.espaciosOcupados ?? 0}
                  </span>
                </div>
              </div>
              <div className="w-full flex items-start">
                <div className="flex items-center gap-2">
                  <div className="rounded-full w-4 h-4 bg-blue-200"></div>
                  <span className="text-sm text-gray-400">
                    Disponibles: {data?.espaciosDisponibles ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full rounded-2xl border p-4 gap-4">
          <div className="flex flex-col ">
            <div className="flex items-center gap-4">
              <Clock className="text-blue-400" />
              <span className="text-xl font-semibold">Últimos ingresos</span>
            </div>
            <span className="text-xs text-gray-400">
              Vehículos recientemente estacionados
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {data?.ultimosIngresos && data.ultimosIngresos.length > 0 ? (
              data.ultimosIngresos.map((ticket) => (
                <div
                  key={ticket.id}
                  className="w-full flex items-center justify-between rounded-2xl border py-2 px-4"
                >
                  <span className="text-base font-semibold">
                    {ticket.placa_vehiculo}
                  </span>
                  <div className="flex flex-col gap-1 items-end">
                    <div
                      className={`px-2 py rounded-2xl items-center justify-center flex ${
                        ticket.fecha_hora_salida
                          ? "bg-gray-400"
                          : "bg-green-500"
                      }`}
                    >
                      <span className="text-[10px] text-white font-semibold">
                        {ticket.fecha_hora_salida ? "Finalizado" : "Activo"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatTime(ticket.fecha_hora_ingreso)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-4">
                No hay ingresos recientes
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
