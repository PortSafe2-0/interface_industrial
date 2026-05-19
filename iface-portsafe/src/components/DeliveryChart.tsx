"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { day: "Mon", value: 8  },
  { day: "Jur", value: 14 },
  { day: "Miar", value: 11 },
  { day: "Hoje", value: 23, today: true },
  { day: "Ver",  value: 16 },
  { day: "Sat",  value: 10 },
  { day: "Sun",  value: 6  },
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

export default function DeliveryChart() {
  return (
    <div className="bg-[#0f1e35] border border-[#1e3050] rounded-xl p-4 h-full">
      <div className="text-sm font-head font-semibold text-[#e8f0ff] mb-3 tracking-wide">
        Entregas — últimos 7 dias
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={20}>
          <XAxis
            dataKey="day"
            tick={{ fill: "#7a9bbf", fontSize: 11, fontFamily: "Rajdhani" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,170,255,0.05)" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
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
