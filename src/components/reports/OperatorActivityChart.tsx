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
import type { OperatorActivityData } from "@/interfaces/reports.interface";

interface OperatorActivityChartProps {
  data: OperatorActivityData[];
}

export const OperatorActivityChart = ({ data }: OperatorActivityChartProps) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="nombre_operador"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "monto_recaudado")
                return [`$${value.toFixed(2)}`, "Monto Recaudado"];
              if (name === "tickets_ingreso") return [value, "Ingresos"];
              if (name === "tickets_salida") return [value, "Salidas"];
              return [value, name];
            }}
          />
          <Legend />
          <Bar
            dataKey="tickets_ingreso"
            fill="#3b82f6"
            name="Ingresos"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="tickets_salida"
            fill="#10b981"
            name="Salidas"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="monto_recaudado"
            fill="#f59e0b"
            name="Monto ($)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
