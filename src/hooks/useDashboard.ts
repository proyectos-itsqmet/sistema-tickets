import { useState, useCallback } from "react";
import { env } from "@/configs/env";
import type { TicketsInterface } from "@/interfaces/tickets.interface";

export interface DashboardData {
  //! Espacios
  capacidadTotal: number;
  espaciosOcupados: number;
  espaciosDisponibles: number;
  porcentajeOcupacion: number;

  //! Estadísticas del día
  ingresosHoy: number;
  salidasHoy: number;
  ingresosDineroHoy: number;

  //! Comparación día anterior
  porcentajeCambioIngresos: number;
  porcentajeCambioSalidas: number;
  porcentajeCambioDinero: number;

  //! Últimos ingresos
  ultimosIngresos: TicketsInterface[];
}

export const useDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = env.API_URL;

  const getDashboardData =
    useCallback(async (): Promise<DashboardData | null> => {
      setLoading(true);
      setError(null);

      try {
        //! Obtener todos los datos en paralelo
        const [ticketsRes, parqueaderosRes] = await Promise.all([
          fetch(`${API_URL}/tickets`),
          fetch(`${API_URL}/parqueaderos`),
        ]);

        if (!ticketsRes.ok || !parqueaderosRes.ok) {
          throw new Error("Error al obtener datos del dashboard");
        }

        const tickets: TicketsInterface[] = await ticketsRes.json();
        const parqueaderos = await parqueaderosRes.json();
        const parqueadero = parqueaderos[0];

        //! Fechas para comparación
        const now = new Date();
        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        const yesterdayEnd = new Date(todayStart);

        //! Filtrar tickets de hoy (ingresos)
        const ticketsIngresosHoy = tickets.filter((ticket) => {
          const fechaIngreso = new Date(ticket.fecha_hora_ingreso);
          return fechaIngreso >= todayStart;
        });

        //! Filtrar tickets de hoy (salidas)
        const ticketsSalidasHoy = tickets.filter((ticket) => {
          if (!ticket.fecha_hora_salida) return false;
          const fechaSalida = new Date(ticket.fecha_hora_salida);
          return fechaSalida >= todayStart;
        });

        //! Calcular ingresos de dinero hoy
        const ingresosDineroHoy = ticketsSalidasHoy.reduce(
          (sum, ticket) => sum + (ticket.monto || 0),
          0
        );

        //! Filtrar tickets de ayer (para comparación)
        const ticketsIngresosAyer = tickets.filter((ticket) => {
          const fechaIngreso = new Date(ticket.fecha_hora_ingreso);
          return fechaIngreso >= yesterdayStart && fechaIngreso < yesterdayEnd;
        });

        const ticketsSalidasAyer = tickets.filter((ticket) => {
          if (!ticket.fecha_hora_salida) return false;
          const fechaSalida = new Date(ticket.fecha_hora_salida);
          return fechaSalida >= yesterdayStart && fechaSalida < yesterdayEnd;
        });

        const ingresosDineroAyer = ticketsSalidasAyer.reduce(
          (sum, ticket) => sum + (ticket.monto || 0),
          0
        );

        //! Calcular porcentajes de cambio
        const calcularPorcentajeCambio = (
          hoy: number,
          ayer: number
        ): number => {
          if (ayer === 0) return hoy > 0 ? 100 : 0;
          return Number((((hoy - ayer) / ayer) * 100).toFixed(1));
        };

        //! Espacios
        const capacidadTotal = parqueadero?.capacidad_total || 100;
        const espaciosOcupados = parqueadero?.espacios_ocupados || 0;
        const espaciosDisponibles = capacidadTotal - espaciosOcupados;
        const porcentajeOcupacion = Number(
          ((espaciosOcupados / capacidadTotal) * 100).toFixed(1)
        );

        //! Últimos 5 ingresos (ordenados por fecha más reciente)
        const ultimosIngresos = [...tickets]
          .sort(
            (a, b) =>
              new Date(b.fecha_hora_ingreso).getTime() -
              new Date(a.fecha_hora_ingreso).getTime()
          )
          .slice(0, 5);

        return {
          capacidadTotal,
          espaciosOcupados,
          espaciosDisponibles,
          porcentajeOcupacion,
          ingresosHoy: ticketsIngresosHoy.length,
          salidasHoy: ticketsSalidasHoy.length,
          ingresosDineroHoy: Number(ingresosDineroHoy.toFixed(2)),
          porcentajeCambioIngresos: calcularPorcentajeCambio(
            ticketsIngresosHoy.length,
            ticketsIngresosAyer.length
          ),
          porcentajeCambioSalidas: calcularPorcentajeCambio(
            ticketsSalidasHoy.length,
            ticketsSalidasAyer.length
          ),
          porcentajeCambioDinero: calcularPorcentajeCambio(
            ingresosDineroHoy,
            ingresosDineroAyer
          ),
          ultimosIngresos,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    }, [API_URL]);

  return {
    loading,
    error,
    getDashboardData,
  };
};
