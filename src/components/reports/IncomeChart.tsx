import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { IncomeReportData } from "@/interfaces/reports.interface";

interface IncomeChartProps {
  data: IncomeReportData[];
  tipo: "diario" | "mensual";
}

export const IncomeChart = ({ data, tipo }: IncomeChartProps) => {
  const formatDate = (dateStr: string) => {
    if (tipo === "mensual") {
      const [year, month] = dateStr.split("-");
      const months = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      return `${months[parseInt(month) - 1]} ${year}`;
    }
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-EC", { day: "2-digit", month: "short" });
  };

  const formattedData = data.map((item) => ({
    ...item,
    fechaFormateada: formatDate(item.fecha),
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="fechaFormateada"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "ingresos")
                return [`$${value.toFixed(2)}`, "Ingresos"];
              return [value, "Tickets"];
            }}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="ingresos"
            fill="#10b981"
            name="Ingresos ($)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="cantidad_tickets"
            fill="#3b82f6"
            name="Tickets"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
