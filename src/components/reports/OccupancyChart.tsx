import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { OccupancyReportData } from "@/interfaces/reports.interface";

interface OccupancyChartProps {
  data: OccupancyReportData[];
}

export const OccupancyChart = ({ data }: OccupancyChartProps) => {
  const formatDate = (dateStr: string) => {
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
        <AreaChart
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
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)}%`, "Ocupación"]}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="porcentaje_ocupacion"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.3}
            name="Ocupación"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
