"use client";
import { useState } from "react";
import { Locker, LockerStatus } from "../types";

interface LockerMapProps { lockers: Locker[]; }

const statusStyles: Record<LockerStatus, string> = {
  empty:    "bg-[#132340] text-[#3d5a7a] border-[#1e3050] hover:border-[#3d5a7a]",
  occupied: "bg-[#00aaff]/20 text-[#00aaff] border-[#00aaff]/40",
  error:    "locker-error text-white border-transparent",
  overdue:  "bg-[#ffa62b]/20 text-[#ffa62b] border-[#ffa62b]/40",
  freed:    "locker-freed text-white border-transparent",
};

const legend = [
  { color: "bg-[#132340] border border-[#1e3050]", label: "Empto" },
  { color: "bg-[#00aaff]/20 border border-[#00aaff]/40", label: "Ocupado" },
  { color: "bg-[#ff4d6a]", label: "Open/error" },
  { color: "bg-[#ffa62b]/20 border border-[#ffa62b]/40", label: "+24h pendente" },
  { color: "bg-[#00c88c]", label: "Recente liberado" },
];

interface Tooltip { locker: Locker; x: number; y: number; }

export default function LockerMap({ lockers }: LockerMapProps) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  return (
    <div className="bg-[#0f1e35] border border-[#1e3050] rounded-xl p-4 relative">
      <div className="text-sm font-head font-semibold text-[#e8f0ff] mb-3 tracking-wide">
        Mapa de Armários
      </div>

      {/* Grid */}
      <div className="grid grid-cols-8 gap-1.5 mb-3">
        {lockers.map((locker) => (
          <div
            key={locker.id}
            className={`relative rounded-lg border text-xs font-head font-bold flex items-center justify-center cursor-pointer transition-all duration-200 aspect-square ${statusStyles[locker.status]}`}
            onMouseEnter={(e) => {
              if (locker.status !== "empty") {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                setTooltip({ locker, x: rect.left, y: rect.top });
              }
            }}
            onMouseLeave={() => setTooltip(null)}
          >
            {locker.number}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {legend.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-[10px] text-[#7a9bbf]">{label}</span>
          </div>
        ))}
      </div>

      {/* Tooltip (fixed position) */}
      {tooltip && tooltip.locker.status !== "empty" && (
        <div
          className="fixed z-50 bg-[#0a1628] border border-[#00aaff]/40 rounded-lg px-3 py-2 shadow-xl text-xs pointer-events-none"
          style={{ top: tooltip.y - 80, left: tooltip.x }}
        >
          <div className="text-[#e8f0ff] font-semibold">Apto: {tooltip.locker.apt}</div>
          <div className="text-[#7a9bbf]">Morador: {tooltip.locker.resident}</div>
          {tooltip.locker.waitTime && (
            <div className="text-[#ffa62b]">Espera: {tooltip.locker.waitTime}</div>
          )}
          <div className="mt-1.5">
            <button className="text-[#00aaff] text-[10px] underline underline-offset-2">
              [Abrir Manualmente]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
