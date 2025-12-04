import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { FrequentVehicleData } from "@/interfaces/reports.interface";

interface FrequentVehiclesChartProps {
  data: FrequentVehicleData[];
}

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#f97316",
  "#6366f1",
];

export const FrequentVehiclesChart = ({ data }: FrequentVehiclesChartProps) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            dataKey="placa_vehiculo"
            type="category"
            tick={{ fontSize: 12 }}
            width={70}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "cantidad_visitas") return [value, "Visitas"];
              return [`$${value.toFixed(2)}`, "Monto Total"];
            }}
          />
          <Bar dataKey="cantidad_visitas" name="Visitas" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
