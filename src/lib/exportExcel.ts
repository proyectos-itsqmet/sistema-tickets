import * as XLSX from "xlsx";
import type {
  IncomeReportData,
  OccupancyReportData,
  FrequentVehicleData,
  OperatorActivityData,
} from "@/interfaces/reports.interface";

type ReportData =
  | IncomeReportData[]
  | OccupancyReportData[]
  | FrequentVehicleData[]
  | OperatorActivityData[];

interface ExportConfig {
  filename: string;
  sheetName: string;
  headers: Record<string, string>;
}

const formatDataForExport = (
  data: ReportData,
  headers: Record<string, string>
): Record<string, unknown>[] => {
  return data.map((item) => {
    const formattedItem: Record<string, unknown> = {};
    const itemRecord = item as unknown as Record<string, unknown>;
    Object.entries(headers).forEach(([key, label]) => {
      formattedItem[label] = itemRecord[key];
    });
    return formattedItem;
  });
};

export const exportToExcel = (
  data: ReportData,
  type: "income" | "occupancy" | "frequent" | "operator",
  dateRange: { inicio: string; fin: string }
) => {
  const configs: Record<string, ExportConfig> = {
    income: {
      filename: `reporte_ingresos_${dateRange.inicio}_${dateRange.fin}`,
      sheetName: "Ingresos",
      headers: {
        fecha: "Fecha",
        ingresos: "Ingresos ($)",
        cantidad_tickets: "Cantidad de Tickets",
      },
    },
    occupancy: {
      filename: `reporte_ocupacion_${dateRange.inicio}_${dateRange.fin}`,
      sheetName: "Ocupación",
      headers: {
        fecha: "Fecha",
        espacios_ocupados: "Espacios Ocupados",
        capacidad_total: "Capacidad Total",
        porcentaje_ocupacion: "Ocupación (%)",
      },
    },
    frequent: {
      filename: `reporte_vehiculos_frecuentes_${dateRange.inicio}_${dateRange.fin}`,
      sheetName: "Vehículos Frecuentes",
      headers: {
        placa_vehiculo: "Placa",
        cantidad_visitas: "Cantidad de Visitas",
        monto_total: "Monto Total ($)",
        ultima_visita: "Última Visita",
      },
    },
    operator: {
      filename: `reporte_actividad_operadores_${dateRange.inicio}_${dateRange.fin}`,
      sheetName: "Actividad Operadores",
      headers: {
        nombre_operador: "Operador",
        tickets_ingreso: "Tickets de Ingreso",
        tickets_salida: "Tickets de Salida",
        monto_recaudado: "Monto Recaudado ($)",
      },
    },
  };

  const config = configs[type];

  const formattedData = formatDataForExport(data, config.headers);

  //! Crear workbook y worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  //! Ajustar ancho de columnas
  const columnWidths = Object.values(config.headers).map((header) => ({
    wch: Math.max(header.length + 5, 15),
  }));
  worksheet["!cols"] = columnWidths;

  //! Agregar worksheet al workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, config.sheetName);

  //! Descargar archivo
  XLSX.writeFile(workbook, `${config.filename}.xlsx`);
};
