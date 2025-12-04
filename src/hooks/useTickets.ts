import { useState, useCallback } from "react";

import type { TicketsInterface } from "@/interfaces/tickets.interface";
import { env } from "@/configs/env";

export const useTickets = () => {
  const [loading, setLoading] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${env.API_URL}/tickets`;
  const PARQUEADEROS_URL = `${env.API_URL}/parqueaderos`;
  const FACTURAS_URL = `${env.API_URL}/facturas`;

  //? >>> Obtener espacios disponibles del parqueadero
  const getEspaciosDisponibles = useCallback(async (): Promise<number> => {
    try {
      const [parqueaderosRes, ticketsRes] = await Promise.all([
        fetch(`${PARQUEADEROS_URL}/1`),
        fetch(API_URL),
      ]);

      if (!parqueaderosRes.ok || !ticketsRes.ok) return 0;

      const parqueadero = await parqueaderosRes.json();
      const tickets: TicketsInterface[] = await ticketsRes.json();

      const ticketsActivos = tickets.filter(
        (ticket) => ticket.fecha_hora_salida === null
      );

      return parqueadero.capacidad_total - ticketsActivos.length;
    } catch (err) {
      console.error("Error al obtener espacios disponibles:", err);
      return 0;
    }
  }, [PARQUEADEROS_URL, API_URL]);
  //? <<<

  //? >>> Actualizar espacios ocupados del parqueadero
  const updateParqueaderoCapacity = useCallback(
    async (parqueaderoId: number, increment: boolean): Promise<boolean> => {
      try {
        //! Obtenerel parqueadero actual
        const response = await fetch(`${PARQUEADEROS_URL}/${parqueaderoId}`);
        if (!response.ok) return false;

        const parqueadero = await response.json();
        const newEspaciosOcupados = increment
          ? parqueadero.espacios_ocupados + 1
          : parqueadero.espacios_ocupados - 1;

        //! Actualizar espacios ocupados
        const updateResponse = await fetch(
          `${PARQUEADEROS_URL}/${parqueaderoId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ espacios_ocupados: newEspaciosOcupados }),
          }
        );

        return updateResponse.ok;
      } catch (err) {
        console.error("Error al actualizar capacidad del parqueadero:", err);
        return false;
      }
    },
    [PARQUEADEROS_URL]
  );
  //? <<<

  //? >>> Crear factura
  const createFactura = useCallback(
    async ({
      id_ticket,
      monto_total,
      metodo_pago,
      id_usuario_emision,
    }: {
      id_ticket: number;
      monto_total: number;
      metodo_pago: string;
      id_usuario_emision: number;
    }): Promise<boolean> => {
      try {
        // Obtener el último ID de factura
        const responseLastId = await fetch(FACTURAS_URL);
        const facturas = await responseLastId.json();
        const maxId =
          facturas.length > 0
            ? Math.max(
                ...facturas.map((f: { id: string | number }) => Number(f.id))
              )
            : 0;

        // Obtener fecha local en formato ISO sin zona horaria
        const now = new Date();
        const localISOTime = new Date(
          now.getTime() - now.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, -1);

        const factura = {
          id: String(maxId + 1),
          id_ticket,
          monto_total,
          fecha_emision: localISOTime,
          metodo_pago,
          id_usuario_emision,
        };

        const response = await fetch(FACTURAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(factura),
        });

        return response.ok;
      } catch (err) {
        console.error("Error al crear la factura:", err);
        return false;
      }
    },
    [FACTURAS_URL]
  );
  //? <<<

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

  //? >>> Obtener todos los tickets activos
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

  //? >>> Obtener tickets del día actual
  const getTicketsToday = useCallback(async (): Promise<TicketsInterface[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Error al obtener los tickets");
      }

      const allTickets: TicketsInterface[] = await response.json();

      // Filtrar tickets del día actual
      const today = new Date();
      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const ticketsToday = allTickets.filter((ticket) => {
        const fechaIngreso = new Date(ticket.fecha_hora_ingreso);
        const fechaSalida = ticket.fecha_hora_salida
          ? new Date(ticket.fecha_hora_salida)
          : null;

        // Incluir si ingresó hoy O si salió hoy
        return (
          fechaIngreso >= todayStart ||
          (fechaSalida && fechaSalida >= todayStart)
        );
      });

      return ticketsToday;
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

  //? >>> Registrar nuevo ticket
  const createTicket = useCallback(
    async ({
      placa_vehiculo,
      id_operador_ingreso,
      tarifa,
    }: {
      placa_vehiculo: string;
      id_operador_ingreso: number;
      tarifa: number;
    }): Promise<{
      ticket: TicketsInterface;
      espaciosDisponibles: number;
    } | null> => {
      setLoading(true);
      setError(null);

      try {
        const responseLastId = await fetch(`${API_URL}`);

        const dataLastId: TicketsInterface[] = await responseLastId.json();

        if (dataLastId.length === 0) {
          return null;
        }

        const maxId = Math.max(...dataLastId.map((item) => Number(item.id)));

        //! Obtener fecha local en formato ISO sin zona horaria
        const now = new Date();
        const localISOTime = new Date(
          now.getTime() - now.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, -1);

        const ticket: TicketsInterface = {
          id: maxId + 1,
          placa_vehiculo: placa_vehiculo,
          fecha_hora_ingreso: localISOTime,
          fecha_hora_salida: null,
          tiempo_permanencia: null,
          id_operador_ingreso: id_operador_ingreso,
          id_operador_salida: null,
          monto: null,
          tarifa: tarifa,
          metodo_pago: null,
        };

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ticket),
        });

        if (!response.ok) {
          setError("Error al crear el ticket");
          return null;
        }

        const data = await response.json();

        //! Incrementar espacios ocupados del parqueadero
        await updateParqueaderoCapacity(1, true);

        //! Obtener espacios disponibles actualizados
        const espaciosDisponibles = await getEspaciosDisponibles();

        return { ticket: data, espaciosDisponibles };
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
    [API_URL, updateParqueaderoCapacity, getEspaciosDisponibles]
  );
  //? <<<

  //? >>> Actualizar ticket
  const updatedTicket = useCallback(
    async ({
      ticket,
      id_operador_salida,
      tiempo_permanencia,
      monto,
      metodo_pago,
    }: {
      ticket: TicketsInterface;
      id_operador_salida: number;
      tiempo_permanencia: string;
      monto: number;
      metodo_pago: string;
    }): Promise<TicketsInterface | null> => {
      setLoading(true);
      setError(null);
      try {
        //! Obtener fecha local en formato ISO sin zona horaria
        const now = new Date();
        const localISOTime = new Date(
          now.getTime() - now.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, -1);

        const ticketUpdate: TicketsInterface = {
          id: ticket.id,
          placa_vehiculo: ticket.placa_vehiculo,
          fecha_hora_ingreso: ticket.fecha_hora_ingreso,
          fecha_hora_salida: localISOTime,
          tiempo_permanencia: tiempo_permanencia,
          id_operador_ingreso: ticket.id_operador_ingreso,
          id_operador_salida: id_operador_salida,
          monto: monto,
          tarifa: ticket.tarifa,
          metodo_pago: metodo_pago,
        };

        const response = await fetch(`${API_URL}/${ticket.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ticketUpdate),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar el ticket");
        }

        const data = await response.json();

        //! Reducir espacios ocupados del parqueadero
        await updateParqueaderoCapacity(1, false);

        //! Generar factura
        await createFactura({
          id_ticket: Number(ticket.id),
          monto_total: monto,
          metodo_pago: metodo_pago,
          id_usuario_emision: id_operador_salida,
        });

        return data;
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
    [API_URL, updateParqueaderoCapacity, createFactura]
  );
  //? <<<

  return {
    loadingTickets,
    loading,
    error,
    getTickets,
    getTicketsByFechaSalida,
    getTicketsToday,
    createTicket,
    updatedTicket,
    getEspaciosDisponibles,
  };
};
