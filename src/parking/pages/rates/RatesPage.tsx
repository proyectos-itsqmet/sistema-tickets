import { RatesDatatable } from "@/components/rates/RatesDatatable";
// import { Button } from "@/components/ui/button";
import { useRates } from "@/hooks/useRates";
import type { RatesInterface } from "@/interfaces/rates.interface";
import { DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const RatesPage = () => {
  const { getRates, createRate, disableRate, loading } = useRates();
  const { user } = useAuth();
  const [data, setData] = useState<RatesInterface[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchRates = async () => {
      const rates = await getRates();
      if (isMounted) {
        setData(rates);
      }
    };

    fetchRates();

    return () => {
      isMounted = false;
    };
  }, [getRates, refreshKey]);

  const handleDisableRate = async (rateId: number, newTarifa: number) => {
    //! Crear la nueva tarifa
    const newRate = await createRate(newTarifa, user?.id || 1);

    if (!newRate) {
      toast.error("Error", {
        description: "No se pudo crear la nueva tarifa",
      });
      return;
    }

    //! Deshabilitar la tarifa anterior
    const disabled = await disableRate(rateId);

    if (disabled) {
      toast.success("Tarifa actualizada", {
        description: `Nueva tarifa de $${newTarifa.toFixed(
          2
        )}/hora creada exitosamente`,
      });
      //! Refrescar datos
      setRefreshKey((prev) => prev + 1);
    } else {
      toast.error("Error", {
        description: "No se pudo deshabilitar la tarifa anterior",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:justify-between md:items-center gap-4 px-2">
        <div className="flex flex-col items-start justify-center">
          <h3 className="text-xl font-semibold">Tarifas</h3>
          <span className="text-sm text-gray-400">
            Configuración de tarifas
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 h-full w-full px-2 gap-6">
        <div className="flex flex-col w-full rounded-2xl border p-4 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col ">
              <div className="flex items-center gap-4">
                <DollarSign className="text-blue-400" />
                <span className="text-xl font-semibold">Tarifas Vigentes</span>
              </div>
              <span className="text-xs text-gray-400">Precios por hora</span>
            </div>
            {/* <Button className="bg-emerald-500 hover:bg-emerald-400 cursor-pointer">
              Registrar tarifa
            </Button> */}
          </div>
          <RatesDatatable
            data={data}
            loading={loading}
            onDisableRate={handleDisableRate}
          />
        </div>
      </div>
    </div>
  );
};
