"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface DeliveryChartProps {
  data?: Array<{ day: string; value: number; today?: boolean }>;
}

const defaultData = [
  { day: "Dom", value: 8 },
  { day: "Seg", value: 14 },
  { day: "Ter", value: 11 },
  { day: "Qua", value: 19 },
  { day: "Qui", value: 23, today: true },
  { day: "Sex", value: 16 },
  { day: "Sab", value: 6 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0a1628] border border-[#1e3050] rounded-lg px-3 py-2 text-xs">
        <div className="text-[#7a9bbf]">{label}</div>
        <div className="text-[#00aaff] font-bold">{payload[0].value} entregas</div>
      </div>
    );
  }
  return null;
};

export default function DeliveryChart({ data }: DeliveryChartProps) {
  const chartData = data && data.length > 0 ? data : defaultData;
  return (
    <div className="bg-[#0f1e35] border border-[#1e3050] rounded-xl p-4 h-full">
      <div className="text-sm font-head font-semibold text-[#e8f0ff] mb-3 tracking-wide">
        Entregas — últimos 7 dias
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData} barSize={20}>
          <XAxis
            dataKey="day"
            tick={{ fill: "#7a9bbf", fontSize: 11, fontFamily: "Rajdhani" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,170,255,0.05)" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {(chartData || []).map((entry, index) => (
              <Cell
                key={index}
                fill={entry.today ? "#00aaff" : "#1a3a5c"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
