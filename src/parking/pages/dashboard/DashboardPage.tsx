import { Car, CircleParking, Clock, DollarSign, LogOut } from "lucide-react";

export const DashboardPage = () => {
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
              <span className="text-2xl font-bold">{"3 / 100"}</span>
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
              <span className="text-2xl font-bold">{2}</span>
              <span className="text-xs text-gray-400">12%</span>
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
              <span className="text-2xl font-bold">{1}</span>
              <span className="text-xs text-gray-400">12%</span>
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
              <span className="text-2xl font-bold">${1}</span>
              <span className="text-xs text-gray-400">12%</span>
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
            <span className="text-2xl font-bold">45%</span>
            <div className="rounded-full bg-blue-200 h-4 w-full"></div>
            <div className="flex items-center justify-between">
              <div className="w-full flex items-start">
                <div className="flex items-center gap-2">
                  <div className="rounded-full w-4 h-4 bg-blue-500"></div>
                  <span className="text-sm text-gray-400">Ocupados: 45</span>
                </div>
              </div>
              <div className="w-full flex items-start">
                <div className="flex items-center gap-2">
                  <div className="rounded-full w-4 h-4 bg-blue-200"></div>
                  <span className="text-sm text-gray-400">Disponibles: 55</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full rounded-2xl border p-4 gap-4">
          <div className="flex flex-col ">
            <div className="flex items-center gap-4">
              <Clock className="text-blue-400" />
              <span className="text-xl font-semibold">Ultimos ingresos</span>
            </div>
            <span className="text-xs text-gray-400">
              Vehículos recientemente estacionados
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-full flex items-center justify-between rounded-2xl border py-2 px-4">
              <span className="text-base font-semibold">ABC-123</span>
              <div className="flex flex-col gap-1">
                <div className="bg-green-500 px-2 py rounded-2xl items-center justify-center flex">
                  <span className="text-[10px] text-white font-semibold">
                    Activo
                  </span>
                </div>
                <span className="text-xs text-gray-400">07:47 p. m.</span>
              </div>
            </div>
            <div className="w-full flex items-center justify-between rounded-2xl border py-2 px-4">
              <span className="text-base font-semibold">ABC-123</span>
              <div className="flex flex-col gap-1">
                <div className="bg-green-500 px-2 py rounded-2xl items-center justify-center flex">
                  <span className="text-[10px] text-white font-semibold">
                    Activo
                  </span>
                </div>
                <span className="text-xs text-gray-400">07:47 p. m.</span>
              </div>
            </div>
            <div className="w-full flex items-center justify-between rounded-2xl border py-2 px-4">
              <span className="text-base font-semibold">ABC-123</span>
              <div className="flex flex-col gap-1">
                <div className="bg-green-500 px-2 py rounded-2xl items-center justify-center flex">
                  <span className="text-[10px] text-white font-semibold">
                    Activo
                  </span>
                </div>
                <span className="text-xs text-gray-400">07:47 p. m.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
