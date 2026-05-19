"use client";
import { Package, Grid3X3, Clock, Bell } from "lucide-react";
import { KPI } from "../types";

interface KPICardsProps { kpi: KPI; }

export default function KPICards({ kpi }: KPICardsProps) {
  const pct = (kpi.lockersOccupied / kpi.lockersTotal) * 100;
  const barColor = pct < 70 ? "#00c88c" : pct < 90 ? "#ffa62b" : "#ff4d6a";
  const diff = kpi.deliveriesToday - kpi.deliveriesYesterday;

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Deliveries today */}
      <div className="bg-[#163962] border border-[#1e3050] rounded-xl p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-[#ffffff] font-medium uppercase tracking-wide">Entregas hoje</span>
          <Package size={14} className="text-[#00aaff]" />
        </div>
        <div className="kpi-value text-3xl font-head font-bold text-[#e8f0ff]">{kpi.deliveriesToday}</div>
        <div className="text-[11px] text-[#00c88c] mt-1">
          ↑ {diff} em relação a ontem
        </div>
      </div>

      {/* Lockers occupied */}
      <div className="bg-[#163962] border border-[#1e3050] rounded-xl p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-[#ffffff] font-medium uppercase tracking-wide">Armários ocupados</span>
          <Grid3X3 size={14} className="text-[#00aaff]" />
        </div>
        <div className="kpi-value text-3xl font-head font-bold text-[#e8f0ff]">
          {kpi.lockersOccupied} <span className="text-lg text-[#7a9bbf]">/ {kpi.lockersTotal}</span>
        </div>
        <div className="mt-2 h-1.5 bg-[#1a2d50] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      {/* Overdue */}
      <div className="bg-[#163962] border border-[#1e3050] rounded-xl p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-[#ffffff] font-medium uppercase tracking-wide">Pendentes +24h</span>
          <Clock size={14} className={kpi.overdue > 0 ? "text-[#ff4d6a]" : "text-[#7a9bbf]"} />
        </div>
        <div className={`kpi-value text-3xl font-head font-bold ${kpi.overdue > 0 ? "text-[#ff4d6a]" : "text-[#e8f0ff]"}`}>
          {kpi.overdue}
        </div>
        <div className="text-[11px] text-[#CCDFF3] mt-1">requerem atenção</div>
      </div>

      {/* Active alerts */}
      <div className="bg-[#163962] border border-[#1e3050] rounded-xl p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-[#ffffff] font-medium uppercase tracking-wide">Alertas ativos</span>
          <Bell size={14} className={kpi.activeAlerts > 0 ? "text-[#ffa62b] pulse-dot" : "text-[#7a9bbf]"} />
        </div>
        <div className={`kpi-value text-3xl font-head font-bold ${kpi.activeAlerts > 0 ? "text-[#ffa62b]" : "text-[#e8f0ff]"}`}>
          {kpi.activeAlerts}
        </div>
        <div className="text-[11px] text-[#CCDFF3] mt-1">{kpi.lastAlertMsg}</div>
      </div>
    </div>
  );
}
