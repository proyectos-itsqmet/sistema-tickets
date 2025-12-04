import { useState, useCallback } from "react";
import { env } from "@/configs/env";
import type { TicketsInterface } from "@/interfaces/tickets.interface";
import type { UserInterface } from "@/interfaces/user.interface";
import type {
  IncomeReportData,
  OccupancyReportData,
  FrequentVehicleData,
  OperatorActivityData,
} from "@/interfaces/reports.interface";

// Helper para obtener fecha local en formato YYYY-MM-DD
const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = env.API_URL;

  //? >>> Obtener reporte de ingresos (diario o mensual)
  const getIncomeReport = useCallback(
    async (
      fechaInicio: string,
      fechaFin: string,
      tipo: "diario" | "mensual" = "diario"
    ): Promise<IncomeReportData[]> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/tickets`);
        if (!response.ok) throw new Error("Error al obtener tickets");

        const tickets: TicketsInterface[] = await response.json();

        //! Filtrar tickets cerrados (con fecha_hora_salida) en el rango de fechas
        const ticketsFiltrados = tickets.filter((ticket) => {
          if (!ticket.fecha_hora_salida || !ticket.monto) return false;

          const fechaSalida = new Date(ticket.fecha_hora_salida);
          const inicio = new Date(fechaInicio);
          const fin = new Date(fechaFin);
          fin.setHours(23, 59, 59, 999);

          return fechaSalida >= inicio && fechaSalida <= fin;
        });

        //! Agrupar por fecha (diario) o por mes (mensual)
        const agrupado = new Map<
          string,
          { ingresos: number; cantidad: number }
        >();

        ticketsFiltrados.forEach((ticket) => {
          const fecha = new Date(ticket.fecha_hora_salida!);
          let key: string;

          if (tipo === "diario") {
            key = getLocalDateString(fecha);
          } else {
            key = `${fecha.getFullYear()}-${String(
              fecha.getMonth() + 1
            ).padStart(2, "0")}`;
          }

          const existing = agrupado.get(key) || { ingresos: 0, cantidad: 0 };
          agrupado.set(key, {
            ingresos: existing.ingresos + (ticket.monto || 0),
            cantidad: existing.cantidad + 1,
          });
        });

        //! Ordenar
        const resultado: IncomeReportData[] = Array.from(agrupado.entries())
          .map(([fecha, data]) => ({
            fecha,
            ingresos: Number(data.ingresos.toFixed(2)),
            cantidad_tickets: data.cantidad,
          }))
          .sort((a, b) => a.fecha.localeCompare(b.fecha));

        return resultado;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error(err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );
  //? <<<

  //? >>> Obtener reporte de ocupación
  const getOccupancyReport = useCallback(
    async (
      fechaInicio: string,
      fechaFin: string
    ): Promise<OccupancyReportData[]> => {
      setLoading(true);
      setError(null);

      try {
        const [ticketsRes, parqueaderosRes] = await Promise.all([
          fetch(`${API_URL}/tickets`),
          fetch(`${API_URL}/parqueaderos`),
        ]);

        if (!ticketsRes.ok || !parqueaderosRes.ok) {
          throw new Error("Error al obtener datos");
        }

        const tickets: TicketsInterface[] = await ticketsRes.json();
        const parqueaderos = await parqueaderosRes.json();
        const capacidadTotal = parqueaderos[0]?.capacidad_total || 100;

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59, 999);

        //! Calcular ocupación por día
        const ocupacionPorDia = new Map<string, number[]>();

        //! Para cada día en el rango
        const currentDate = new Date(inicio);
        while (currentDate <= fin) {
          const dateKey = getLocalDateString(currentDate);
          ocupacionPorDia.set(dateKey, []);
          currentDate.setDate(currentDate.getDate() + 1);
        }

        //! Calcular vehículos en el parqueadero para cada día
        tickets.forEach((ticket) => {
          const ingreso = new Date(ticket.fecha_hora_ingreso);
          const salida = ticket.fecha_hora_salida
            ? new Date(ticket.fecha_hora_salida)
            : new Date();

          ocupacionPorDia.forEach((ocupaciones, dateKey) => {
            const fecha = new Date(dateKey);
            fecha.setHours(12, 0, 0, 0);

            if (ingreso <= fecha && salida >= fecha) {
              ocupaciones.push(1);
            }
          });
        });

        const resultado: OccupancyReportData[] = Array.from(
          ocupacionPorDia.entries()
        )
          .map(([fecha, ocupaciones]) => {
            const espaciosOcupados = ocupaciones.length;
            return {
              fecha,
              espacios_ocupados: espaciosOcupados,
              capacidad_total: capacidadTotal,
              porcentaje_ocupacion: Number(
                ((espaciosOcupados / capacidadTotal) * 100).toFixed(2)
              ),
            };
          })
          .sort((a, b) => a.fecha.localeCompare(b.fecha));

        return resultado;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error(err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );
  //? <<<

  //? >>> Obtener reporte de vehículos frecuentes
  const getFrequentVehicles = useCallback(
    async (
      fechaInicio: string,
      fechaFin: string,
      limit: number = 10
    ): Promise<FrequentVehicleData[]> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/tickets`);
        if (!response.ok) throw new Error("Error al obtener tickets");

        const tickets: TicketsInterface[] = await response.json();

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59, 999);

        //! Filtrar por rango de fechas
        const ticketsFiltrados = tickets.filter((ticket) => {
          const fechaIngreso = new Date(ticket.fecha_hora_ingreso);
          return fechaIngreso >= inicio && fechaIngreso <= fin;
        });

        //! Agrupar por placa
        const vehiculos = new Map<
          string,
          { cantidad: number; monto: number; ultimaVisita: string }
        >();

        ticketsFiltrados.forEach((ticket) => {
          const existing = vehiculos.get(ticket.placa_vehiculo) || {
            cantidad: 0,
            monto: 0,
            ultimaVisita: ticket.fecha_hora_ingreso,
          };

          vehiculos.set(ticket.placa_vehiculo, {
            cantidad: existing.cantidad + 1,
            monto: existing.monto + (ticket.monto || 0),
            ultimaVisita:
              ticket.fecha_hora_ingreso > existing.ultimaVisita
                ? ticket.fecha_hora_ingreso
                : existing.ultimaVisita,
          });
        });

        const resultado: FrequentVehicleData[] = Array.from(vehiculos.entries())
          .map(([placa, data]) => ({
            placa_vehiculo: placa,
            cantidad_visitas: data.cantidad,
            monto_total: Number(data.monto.toFixed(2)),
            ultima_visita: data.ultimaVisita,
          }))
          .sort((a, b) => b.cantidad_visitas - a.cantidad_visitas)
          .slice(0, limit);

        return resultado;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error(err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );
  //? <<<

  //? >>> Obtener reporte de actividad por operador
  const getOperatorActivity = useCallback(
    async (
      fechaInicio: string,
      fechaFin: string
    ): Promise<OperatorActivityData[]> => {
      setLoading(true);
      setError(null);

      try {
        const [ticketsRes, usersRes] = await Promise.all([
          fetch(`${API_URL}/tickets`),
          fetch(`${API_URL}/users`),
        ]);

        if (!ticketsRes.ok || !usersRes.ok) {
          throw new Error("Error al obtener datos");
        }

        const tickets: TicketsInterface[] = await ticketsRes.json();
        const users: UserInterface[] = await usersRes.json();

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59, 999);

        //! Usuarios
        const usersMap = new Map<number, string>();
        users.forEach((user) => {
          usersMap.set(Number(user.id), `${user.firstName} ${user.lastName}`);
        });

        //! Agrupar actividad por operador
        const operadores = new Map<
          number,
          { ingreso: number; salida: number; monto: number }
        >();

        tickets.forEach((ticket) => {
          const fechaIngreso = new Date(ticket.fecha_hora_ingreso);
          const fechaSalida = ticket.fecha_hora_salida
            ? new Date(ticket.fecha_hora_salida)
            : null;

          //! Contar ingresos
          if (fechaIngreso >= inicio && fechaIngreso <= fin) {
            const existingIngreso = operadores.get(
              ticket.id_operador_ingreso
            ) || {
              ingreso: 0,
              salida: 0,
              monto: 0,
            };
            operadores.set(ticket.id_operador_ingreso, {
              ...existingIngreso,
              ingreso: existingIngreso.ingreso + 1,
            });
          }

          //! Contar salidas y monto
          if (
            fechaSalida &&
            fechaSalida >= inicio &&
            fechaSalida <= fin &&
            ticket.id_operador_salida
          ) {
            const existingSalida = operadores.get(
              ticket.id_operador_salida
            ) || {
              ingreso: 0,
              salida: 0,
              monto: 0,
            };
            operadores.set(ticket.id_operador_salida, {
              ...existingSalida,
              salida: existingSalida.salida + 1,
              monto: existingSalida.monto + (ticket.monto || 0),
            });
          }
        });

        //! Convertir a resultado
        const resultado: OperatorActivityData[] = Array.from(
          operadores.entries()
        )
          .map(([id, data]) => ({
            id_operador: id,
            nombre_operador: usersMap.get(id) || `Operador ${id}`,
            tickets_ingreso: data.ingreso,
            tickets_salida: data.salida,
            monto_recaudado: Number(data.monto.toFixed(2)),
          }))
          .sort((a, b) => b.monto_recaudado - a.monto_recaudado);

        return resultado;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error(err);
        return [];
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
    getIncomeReport,
    getOccupancyReport,
    getFrequentVehicles,
    getOperatorActivity,
  };
};
