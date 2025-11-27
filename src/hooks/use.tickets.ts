import { useState, useCallback } from "react";

import type { TicketsInterface } from "@/interfaces/tickets.interface";
import { env } from "@/configs/env";

export const useTickets = () => {
  const [loading, setLoading] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${env.API_URL}/tickets`;

  //? >>> Obtener todos los tickets
  const getTickets = useCallback(async (): Promise<TicketsInterface[]> => {
    setLoadingTickets(true);
    setError(null);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Error al obtener los tickets");
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
      setLoadingTickets(false);
    }
  }, [API_URL]);
  //? <<<

  //? >>> Obtener todos los tickets
  const getTicketsByFechaSalida = useCallback(async (): Promise<
    TicketsInterface[]
  > => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}?fecha_hora_salida=null`);

      if (!response.ok) {
        throw new Error("Error al obtener los tickets");
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

  return {
    loadingTickets,
    loading,
    error,
    getTickets,
    getTicketsByFechaSalida,
  };
};
