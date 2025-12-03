export interface IncomeReportData {
  fecha: string;
  ingresos: number;
  cantidad_tickets: number;
}

export interface OccupancyReportData {
  fecha: string;
  hora?: string;
  espacios_ocupados: number;
  capacidad_total: number;
  porcentaje_ocupacion: number;
}

export interface FrequentVehicleData {
  placa_vehiculo: string;
  cantidad_visitas: number;
  monto_total: number;
  ultima_visita: string;
}

export interface OperatorActivityData {
  id_operador: number;
  nombre_operador: string;
  tickets_ingreso: number;
  tickets_salida: number;
  monto_recaudado: number;
}

export interface ReportFilters {
  fechaInicio: string;
  fechaFin: string;
  tipoReporte: "diario" | "mensual";
}
