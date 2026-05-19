"use client";
import { useState } from "react";
import { Bell, Archive, Package, Wifi, CheckCheck, ChevronDown } from "lucide-react";
import { Alert, FeedEvent } from "../types";

interface AlertsPanelProps {
  alerts: Alert[];
  feed: FeedEvent[];
}

const feedIcons: Record<string, React.ReactNode> = {
  locker:   <Archive size={12} className="text-[#00aaff]" />,
  delivery: <Package size={12} className="text-[#00c88c]" />,
  sensor:   <Wifi size={12} className="text-[#ffa62b]" />,
};

export default function AlertsPanel({ alerts, feed }: AlertsPanelProps) {
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const resolve = (id: string) => setResolvedIds((prev) => new Set([...prev, id]));
  const activeAlerts = alerts.filter((a) => !resolvedIds.has(a.id));

  return (
    <div className="w-[280px] flex-shrink-0 bg-[#0a1628] border-l border-[#1e3050] flex flex-col h-screen overflow-hidden">
      {/* Alerts */}
      <div className="flex-shrink-0 border-b border-[#1e3050]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell size={13} className="text-[#ffa62b]" />
            <span className="text-sm font-head font-semibold text-[#e8f0ff] tracking-wide">Alertas</span>
            {activeAlerts.length > 0 && (
              <span className="bg-[#ffa62b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeAlerts.length}
              </span>
            )}
          </div>
        </div>

        <div className="max-h-56 overflow-y-auto px-3 pb-3 space-y-2">
          {activeAlerts.length === 0 ? (
            <div className="flex flex-col items-center gap-1.5 py-4 text-center">
              <CheckCheck size={20} className="text-[#00c88c]" />
              <span className="text-xs text-[#7a9bbf]">Nenhum alerta ativo</span>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="feed-item bg-[#0f1e35] border border-[#1e3050] border-l-2 border-l-[#ff4d6a] rounded-lg p-2.5"
              >
                <div className="text-[11px] text-[#e8f0ff] leading-snug mb-1">{alert.message}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#3d5a7a] font-mono">{alert.time}</span>
                  <button
                    onClick={() => resolve(alert.id)}
                    className="text-[10px] text-[#00aaff] hover:text-[#00c88c] transition-colors font-medium"
                  >
                    Resolver
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e3050]">
          <span className="text-sm font-head font-semibold text-[#e8f0ff] tracking-wide">
            Atividade recente
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {feed.map((event) => (
            <div key={event.id} className="feed-item flex items-start gap-2.5 py-2 border-b border-[#1e3050]/40">
              <div className="w-6 h-6 rounded-md bg-[#132340] flex items-center justify-center flex-shrink-0 mt-0.5">
                {feedIcons[event.icon]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-[#7a9bbf] leading-snug">{event.message}</div>
                <div className="text-[10px] text-[#3d5a7a] font-mono mt-0.5">{event.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center py-2 border-t border-[#1e3050]">
          <button className="flex items-center gap-1 text-[11px] text-[#3d5a7a] hover:text-[#7a9bbf] transition-colors">
            <ChevronDown size={12} />
            Ver mais
          </button>
        </div>
      </div>
    </div>
  );
}
