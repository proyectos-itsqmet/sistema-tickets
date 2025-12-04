import { useState, useCallback } from "react";

import { env } from "@/configs/env";
import type { RatesInterface } from "@/interfaces/rates.interface";

export const useRates = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${env.API_URL}/tarifas`;

  //? >>> Obtener todos las tarifas
  const getRates = useCallback(async (): Promise<RatesInterface[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Error al obtener las tarifas");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [API_URL]);
  //? <<<

  //? >>> Crear nueva tarifa
  const createRate = useCallback(
    async (
      tarifa_por_hora: number,
      id_usuario_creacion: number
    ): Promise<RatesInterface | null> => {
      setLoading(true);
      setError(null);
      try {
        //! Obtener el último ID
        const rates = await getRates();
        const maxId =
          rates.length > 0 ? Math.max(...rates.map((r) => Number(r.id))) : 0;

        const now = new Date();
        const localISOTime = new Date(
          now.getTime() - now.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, -1);

        const newRate: RatesInterface = {
          id: maxId + 1,
          tarifa_por_hora,
          status: true,
          created_at: localISOTime,
          id_usuario_creacion,
        };

        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRate),
        });

        if (!response.ok) {
          throw new Error("Error al crear la tarifa");
        }

        return await response.json();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, getRates]
  );
  //? <<<

  //? >>> Deshabilitar tarifa
  const disableRate = useCallback(
    async (rateId: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/${rateId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: false }),
        });

        if (!response.ok) {
          throw new Error("Error al deshabilitar la tarifa");
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error(err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );
  //? <<<

  return {
    loading,
    error,
    getRates,
    createRate,
    disableRate,
  };
};
