"use client";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Delivery } from "../types";

interface DeliveriesTableProps { deliveries: Delivery[]; }

const statusBadge: Record<string, string> = {
  Ocupado:  "bg-[#00aaff]/15 text-[#00aaff] border border-[#00aaff]/30",
  Atrasado: "bg-[#ff4d6a]/15 text-[#ff4d6a] border border-[#ff4d6a]/30",
  Retirado: "bg-[#00c88c]/15 text-[#00c88c] border border-[#00c88c]/30",
};

export default function DeliveriesTable({ deliveries }: DeliveriesTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = deliveries.filter(
    (d) =>
      d.resident.toLowerCase().includes(search.toLowerCase()) ||
      d.locker.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#0f1e35] border border-[#1e3050] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-head font-semibold text-[#e8f0ff] tracking-wide">
          Entregas Recentes
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#3d5a7a]" />
            <input
              type="text"
              placeholder="Buscar por morador ou armário..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0a1628] border border-[#1e3050] rounded-lg pl-7 pr-3 py-1.5 text-xs text-[#e8f0ff] placeholder-[#3d5a7a] focus:outline-none focus:border-[#00aaff]/50 w-56"
            />
          </div>
        </div>
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[#1e3050]">
            {["Armário", "Morador", "Entregador", "Chegou em ↓", "Tempo de espera", "Status"].map((h) => (
              <th key={h} className="text-left text-[#7a9bbf] font-medium py-2 px-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((d) => (
            <tr
              key={d.id}
              className={`border-b border-[#1e3050]/50 hover:bg-[#1a2d50]/40 transition-colors ${
                d.status === "Atrasado" ? "border-l-2 border-l-[#ff4d6a]" : ""
              }`}
            >
              <td className="py-2.5 px-2 font-mono text-[#e8f0ff]">{d.locker}</td>
              <td className="py-2.5 px-2 text-[#e8f0ff]">{d.resident}</td>
              <td className="py-2.5 px-2 text-[#7a9bbf]">{d.courier}</td>
              <td className="py-2.5 px-2 text-[#7a9bbf] font-mono">{d.arrivedAt}</td>
              <td className="py-2.5 px-2 text-[#7a9bbf]">{d.waitTime}</td>
              <td className="py-2.5 px-2">
                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium ${statusBadge[d.status]}`}>
                  {d.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          className="p-1 rounded text-[#7a9bbf] hover:text-[#e8f0ff] hover:bg-[#1a2d50] transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        {[1, 2].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-6 h-6 rounded text-xs font-medium transition-colors ${
              page === p
                ? "bg-[#00aaff] text-white"
                : "text-[#7a9bbf] hover:bg-[#1a2d50]"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage(Math.min(2, page + 1))}
          className="p-1 rounded text-[#7a9bbf] hover:text-[#e8f0ff] hover:bg-[#1a2d50] transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
