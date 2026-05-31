"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search, Filter, Package, Clock, CheckCircle, AlertTriangle,
  X, ChevronDown, ChevronUp, ArrowUpDown, Plus,
  MoreHorizontal, QrCode, MapPin, User, Truck,
  Calendar, Archive, RotateCcw, Eye,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { deliveryService } from "@/services/api";

// ── Types ──────────────────────────────────────────────────────────────────
type DeliveryStatus = "Aguardando" | "Atrasado" | "Retirado" | "Cancelado";

interface Delivery {
  id: string;
  code: string;
  locker: string;
  resident: string;
  apt: string;
  courier: string;
  company: string;
  arrivedAt: string;
  retrievedAt?: string;
  waitTime: string;
  status: DeliveryStatus;
  notes?: string;
}

interface TimelineEntry {
  event: string;
  actor: string;
  timestamp: string;
  type: "registered" | "notified" | "opened" | "retrieved" | "alert" | "cancelled";
}

// ── Mock data ──────────────────────────────────────────────────────────────
const DELIVERIES: Delivery[] = [
  { id:"1",  code:"PS-20221122-001", locker:"03", resident:"Ana Oliveira",    apt:"102B", courier:"João Silva",     company:"Correios",   arrivedAt:"22/11/2022 13:17", waitTime:"5h",   status:"Aguardando" },
  { id:"2",  code:"PS-20221122-002", locker:"10", resident:"Patrícia Nunes",  apt:"203",  courier:"Rosa Estandor",  company:"Mercado Livre", arrivedAt:"22/11/2022 11:00", waitTime:"7h",   status:"Atrasado",  notes:"Morador não atendeu notificações" },
  { id:"3",  code:"PS-20221122-003", locker:"06", resident:"Rafael Torres",   apt:"105",  courier:"Pedro Alves",    company:"Amazon",     arrivedAt:"22/11/2022 14:00", waitTime:"3h",   status:"Aguardando" },
  { id:"4",  code:"PS-20221122-004", locker:"04", resident:"Carlos Lima",     apt:"204A", courier:"Lucas Moura",    company:"Shopee",     arrivedAt:"22/11/2022 15:00", waitTime:"2h",   status:"Aguardando" },
  { id:"5",  code:"PS-20221122-005", locker:"17", resident:"Camila Reis",     apt:"401",  courier:"Anna Estaniha",  company:"Correios",   arrivedAt:"22/11/2022 17:15", waitTime:"45min",status:"Aguardando" },
  { id:"6",  code:"PS-20221121-001", locker:"13", resident:"Juliana Alves",   apt:"502",  courier:"João Silva",     company:"iFood Shop", arrivedAt:"21/11/2022 10:00", waitTime:"28h",  status:"Atrasado",  notes:"Segunda tentativa de notificação" },
  { id:"7",  code:"PS-20221121-002", locker:"14", resident:"Roberto Melo",    apt:"308",  courier:"Rosa Estandor",  company:"Amazon",     arrivedAt:"21/11/2022 12:00", waitTime:"26h",  status:"Atrasado" },
  { id:"8",  code:"PS-20221120-001", locker:"02", resident:"Fernanda Costa",  apt:"301",  courier:"Pedro Alves",    company:"Shopee",     arrivedAt:"20/11/2022 09:00", retrievedAt:"20/11/2022 18:30", waitTime:"9h30m", status:"Retirado" },
  { id:"9",  code:"PS-20221120-002", locker:"08", resident:"Marcos Souza",    apt:"407",  courier:"Lucas Moura",    company:"Mercado Livre", arrivedAt:"20/11/2022 11:00", retrievedAt:"20/11/2022 14:00", waitTime:"3h",   status:"Retirado" },
  { id:"10", code:"PS-20221119-001", locker:"15", resident:"Diego Faria",     apt:"206",  courier:"Anna Estaniha",  company:"Correios",   arrivedAt:"19/11/2022 10:00", retrievedAt:"19/11/2022 20:00", waitTime:"10h",  status:"Retirado" },
  { id:"11", code:"PS-20221119-002", locker:"01", resident:"Luiz Henrique",   apt:"110",  courier:"João Silva",     company:"Amazon",     arrivedAt:"19/11/2022 14:00", waitTime:"—",    status:"Cancelado", notes:"Armário com defeito no dia" },
  { id:"12", code:"PS-20221118-001", locker:"05", resident:"Ana Oliveira",    apt:"102B", courier:"Rosa Estandor",  company:"Shopee",     arrivedAt:"18/11/2022 09:30", retrievedAt:"18/11/2022 12:00", waitTime:"2h30m",status:"Retirado" },
];

const TIMELINE: TimelineEntry[] = [
  { event:"Entrega registrada no sistema",        actor:"João Silva (Entregador)",   timestamp:"22/11/2022 13:17", type:"registered" },
  { event:"Notificação enviada ao morador",       actor:"Sistema automático",        timestamp:"22/11/2022 13:18", type:"notified"   },
  { event:"Armário 03 aberto pelo entregador",    actor:"João Silva (Entregador)",   timestamp:"22/11/2022 13:19", type:"opened"     },
  { event:"Segunda notificação enviada",          actor:"Sistema automático",        timestamp:"22/11/2022 15:17", type:"notified"   },
  { event:"Alerta de espera prolongada gerado",   actor:"Sistema automático",        timestamp:"22/11/2022 17:17", type:"alert"      },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<DeliveryStatus, string> = {
  Aguardando: "bg-[#00aaff]/15 text-[#00aaff] border border-[#00aaff]/30",
  Atrasado:   "bg-[#ff4d6a]/15 text-[#ff4d6a] border border-[#ff4d6a]/30",
  Retirado:   "bg-[#00c88c]/15 text-[#00c88c] border border-[#00c88c]/30",
  Cancelado:  "bg-[#3d5a7a]/20 text-[#7a9bbf] border border-[#3d5a7a]/30",
};

const STATUS_ROW_ACCENT: Record<DeliveryStatus, string> = {
  Aguardando: "",
  Atrasado:   "border-l-2 border-l-[#ff4d6a]",
  Retirado:   "",
  Cancelado:  "opacity-60",
};

const TIMELINE_STYLE: Record<string, { color: string; icon: React.ReactNode }> = {
  registered: { color: "bg-[#00aaff]",   icon: <Package size={10} className="text-white" /> },
  notified:   { color: "bg-[#7a9bbf]",   icon: <User size={10} className="text-white" /> },
  opened:     { color: "bg-[#00c88c]",   icon: <Archive size={10} className="text-white" /> },
  retrieved:  { color: "bg-[#00c88c]",   icon: <CheckCircle size={10} className="text-white" /> },
  alert:      { color: "bg-[#ffa62b]",   icon: <AlertTriangle size={10} className="text-white" /> },
  cancelled:  { color: "bg-[#ff4d6a]",   icon: <X size={10} className="text-white" /> },
};

const COMPANY_COLORS: Record<string, string> = {
  "Correios":      "bg-[#ffa62b]/10 text-[#ffa62b]",
  "Mercado Livre": "bg-[#ffd700]/10 text-[#ffd700]",
  "Amazon":        "bg-[#00aaff]/10 text-[#00aaff]",
  "Shopee":        "bg-[#ff4d6a]/10 text-[#ff4d6a]",
  "iFood Shop":    "bg-[#ff4d6a]/10 text-[#ff4d6a]",
};

// ── Delivery Drawer ────────────────────────────────────────────────────────
function DeliveryDrawer({ delivery, onClose }: { delivery: Delivery; onClose: () => void }) {
  const [tab, setTab] = useState<"info" | "timeline">("info");

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[400px] h-full bg-[#0a1628] border-l border-[#1e3050] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1e3050]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-[#00aaff]" />
              <span className="font-head font-bold text-[#e8f0ff] tracking-wide">Detalhe da Entrega</span>
            </div>
            <button onClick={onClose} className="text-[#3d5a7a] hover:text-[#7a9bbf]"><X size={16} /></button>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#7a9bbf]">{delivery.code}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[delivery.status]}`}>
              {delivery.status}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1e3050]">
          {(["info", "timeline"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-head font-semibold tracking-wide transition-colors ${
                tab === t
                  ? "text-[#00aaff] border-b-2 border-[#00aaff]"
                  : "text-[#7a9bbf] hover:text-[#e8f0ff]"
              }`}
            >
              {t === "info" ? "Informações" : "Linha do Tempo"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {tab === "info" && (
            <>
              {/* Main info cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Armário",   value: delivery.locker, icon: <Archive size={12} className="text-[#00aaff]" /> },
                  { label: "Apartamento", value: delivery.apt,  icon: <MapPin size={12} className="text-[#00c88c]" /> },
                  { label: "Chegou em", value: delivery.arrivedAt, icon: <Calendar size={12} className="text-[#7a9bbf]" />, mono: true },
                  { label: "Tempo de espera", value: delivery.waitTime, icon: <Clock size={12} className={delivery.status === "Atrasado" ? "text-[#ff4d6a]" : "text-[#7a9bbf]"} /> },
                ].map(({ label, value, icon, mono }) => (
                  <div key={label} className="bg-[#0f1e35] border border-[#1e3050] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      {icon}
                      <span className="text-[10px] text-[#3d5a7a] uppercase tracking-wide">{label}</span>
                    </div>
                    <div className={`text-sm font-semibold text-[#e8f0ff] ${mono ? "font-mono text-xs" : ""}`}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Resident */}
              <div className="bg-[#0f1e35] border border-[#1e3050] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <User size={12} className="text-[#00aaff]" />
                  <span className="text-[10px] text-[#3d5a7a] uppercase tracking-wide">Morador</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a9bbf]">Nome</span>
                  <span className="text-[#e8f0ff] font-medium">{delivery.resident}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a9bbf]">Apartamento</span>
                  <span className="text-[#e8f0ff]">{delivery.apt}</span>
                </div>
                {delivery.retrievedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7a9bbf]">Retirado em</span>
                    <span className="text-[#00c88c] font-mono text-xs">{delivery.retrievedAt}</span>
                  </div>
                )}
              </div>

              {/* Courier */}
              <div className="bg-[#0f1e35] border border-[#1e3050] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <Truck size={12} className="text-[#00aaff]" />
                  <span className="text-[10px] text-[#3d5a7a] uppercase tracking-wide">Entregador</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a9bbf]">Nome</span>
                  <span className="text-[#e8f0ff] font-medium">{delivery.courier}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a9bbf]">Empresa</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${COMPANY_COLORS[delivery.company] ?? "bg-[#1a2d50] text-[#7a9bbf]"}`}>
                    {delivery.company}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {delivery.notes && (
                <div className="bg-[#ffa62b]/5 border border-[#ffa62b]/20 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle size={11} className="text-[#ffa62b]" />
                    <span className="text-[10px] text-[#ffa62b] uppercase tracking-wide">Observação</span>
                  </div>
                  <p className="text-xs text-[#e8f0ff]">{delivery.notes}</p>
                </div>
              )}

              {/* QR */}
              <div className="bg-[#0f1e35] border border-[#1e3050] border-dashed rounded-xl p-4 flex flex-col items-center gap-2">
                <QrCode size={40} className="text-[#3d5a7a]" />
                <span className="text-xs text-[#7a9bbf]">QR Code de retirada</span>
                <button className="text-[10px] text-[#00aaff] hover:underline">Gerar / reenviar QR Code</button>
              </div>

              {/* Actions */}
              {delivery.status === "Aguardando" || delivery.status === "Atrasado" ? (
                <div className="space-y-2 pt-1">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#00c88c]/10 border border-[#00c88c]/30 text-[#00c88c] text-sm hover:bg-[#00c88c]/20 transition-colors">
                    <CheckCircle size={14} /> Marcar como retirado
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#ff4d6a]/10 border border-[#ff4d6a]/30 text-[#ff4d6a] text-sm hover:bg-[#ff4d6a]/20 transition-colors">
                    <X size={14} /> Cancelar entrega
                  </button>
                </div>
              ) : null}
            </>
          )}

          {tab === "timeline" && (
            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-[14px] top-0 bottom-0 w-px bg-[#1e3050]" />
              <div className="space-y-5">
                {TIMELINE.map((entry, i) => {
                  const style = TIMELINE_STYLE[entry.type];
                  return (
                    <div key={i} className="flex gap-4 relative">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${style.color}`}>
                        {style.icon}
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="text-xs text-[#e8f0ff] font-medium">{entry.event}</div>
                        <div className="text-[10px] text-[#7a9bbf] mt-0.5">{entry.actor}</div>
                        <div className="text-[10px] text-[#3d5a7a] font-mono mt-0.5">{entry.timestamp}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Register Delivery Modal ────────────────────────────────────────────────
function RegisterModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1e35] border border-[#1e3050] rounded-2xl p-6 w-[420px] shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <span className="font-head font-bold text-lg text-[#e8f0ff] tracking-wide">Registrar Entrega</span>
          <button onClick={onClose} className="text-[#3d5a7a] hover:text-[#7a9bbf]"><X size={16} /></button>
        </div>

        <div className="space-y-3">
          {[
            { label: "Armário", placeholder: "Nº do armário", icon: <Archive size={12} /> },
            { label: "Apartamento do morador", placeholder: "Ex: 102B", icon: <MapPin size={12} /> },
            { label: "Nome do entregador", placeholder: "Nome completo", icon: <User size={12} /> },
            { label: "Empresa / transportadora", placeholder: "Ex: Correios, Amazon...", icon: <Truck size={12} /> },
          ].map(({ label, placeholder, icon }) => (
            <div key={label}>
              <label className="text-[10px] text-[#7a9bbf] uppercase tracking-wide block mb-1">{label}</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3d5a7a]">{icon}</div>
                <input
                  type="text"
                  placeholder={placeholder}
                  className="w-full bg-[#0a1628] border border-[#1e3050] rounded-lg pl-8 pr-3 py-2 text-sm text-[#e8f0ff] placeholder-[#3d5a7a] focus:outline-none focus:border-[#00aaff]/50"
                />
              </div>
            </div>
          ))}

          <div>
            <label className="text-[10px] text-[#7a9bbf] uppercase tracking-wide block mb-1">Observações (opcional)</label>
            <textarea
              placeholder="Observações sobre a entrega..."
              rows={2}
              className="w-full bg-[#0a1628] border border-[#1e3050] rounded-lg px-3 py-2 text-sm text-[#e8f0ff] placeholder-[#3d5a7a] focus:outline-none focus:border-[#00aaff]/50 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[#1e3050] text-[#7a9bbf] text-sm hover:bg-[#1a2d50] transition-colors">
            Cancelar
          </button>
          <button className="flex-1 py-2.5 rounded-lg bg-[#00aaff] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function EntregasPage() {
  const { user, isLoading } = useProtectedRoute();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<DeliveryStatus | "all">("all");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [sortField, setSortField] = useState<"arrivedAt" | "waitTime" | "status">("arrivedAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Carregar dados do backend
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const backendDeliveries = await deliveryService.getAll();
        
        // Transformar dados do backend para formato da página
        const transformed: Delivery[] = (backendDeliveries as any[]).map((d) => ({
          id: d.id,
          code: d.trackingCode || `PS-${d.id.slice(0, 8)}`,
          locker: d.locker,
          resident: d.resident,
          apt: d.apt,
          courier: d.courier,
          company: d.company,
          arrivedAt: d.arrivedAt,
          waitTime: d.waitTime,
          status: (d.status === "Ocupado" ? "Aguardando" : d.status === "Atrasado" ? "Atrasado" : "Retirado") as DeliveryStatus,
          notes: undefined,
          retrievedAt: d.status === "Retirado" ? d.arrivedAt : undefined,
        }));
        
        setDeliveries(transformed);
      } catch (error) {
        console.error("Erro ao buscar entregas:", error);
        setDeliveries(DELIVERIES);
      } finally {
        setDataLoading(false);
      }
    };

    if (!isLoading) {
      fetchDeliveries();
    }
  }, [isLoading]);

  const filtered = useMemo(() => {
    return deliveries.filter((d) => {
      const matchSearch =
        d.resident.toLowerCase().includes(search.toLowerCase()) ||
        d.courier.toLowerCase().includes(search.toLowerCase()) ||
        d.code.toLowerCase().includes(search.toLowerCase()) ||
        d.locker.includes(search) ||
        d.apt.toLowerCase().includes(search.toLowerCase());
      const matchStatus  = filterStatus === "all"  || d.status  === filterStatus;
      return matchSearch && matchStatus;
    }).sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      if (sortField === "arrivedAt") return dir * a.arrivedAt.localeCompare(b.arrivedAt);
      if (sortField === "status")    return dir * a.status.localeCompare(b.status);
      return 0;
    });
  }, [deliveries, search, filterStatus, filterPeriod, sortField, sortAsc]);

  const counts = useMemo(() => ({
    total:      deliveries.length,
    aguardando: deliveries.filter((d) => d.status === "Aguardando").length,
    atrasado:   deliveries.filter((d) => d.status === "Atrasado").length,
    retirado:   deliveries.filter((d) => d.status === "Retirado").length,
    cancelado:  deliveries.filter((d) => d.status === "Cancelado").length,
  }), [deliveries]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  if (isLoading || dataLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#060d18]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 rounded-full border-4 border-[#1e3050] border-t-[#00aaff] animate-spin mb-4"></div>
          <p className="text-[#7a9bbf] text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060d18]">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-[#0a1628] border-b border-[#1e3050] px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-head font-bold text-2xl text-[#e8f0ff] tracking-wide">Entregas</h1>
              <p className="text-xs text-[#7a9bbf] mt-0.5">Histórico e gerenciamento de todas as entregas</p>
            </div>
            <button
              onClick={() => setShowRegister(true)}
              className="flex items-center gap-2 bg-[#00aaff] hover:opacity-90 transition-opacity text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              <Plus size={14} /> Registrar entrega
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          {/* KPI cards */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "Total",      value: counts.total,      color: "text-[#e8f0ff]", border: "" },
              { label: "Aguardando", value: counts.aguardando, color: "text-[#00aaff]", border: "border-[#00aaff]/20" },
              { label: "Atrasadas",  value: counts.atrasado,   color: "text-[#ff4d6a]", border: "border-[#ff4d6a]/20" },
              { label: "Retiradas",  value: counts.retirado,   color: "text-[#00c88c]", border: "border-[#00c88c]/20" },
              { label: "Canceladas", value: counts.cancelado,  color: "text-[#7a9bbf]", border: "" },
            ].map(({ label, value, color, border }) => (
              <div key={label} className={`bg-[#0f1e35] border ${border || "border-[#1e3050]"} rounded-xl px-4 py-3 flex items-center justify-between`}>
                <span className="text-xs text-[#7a9bbf]">{label}</span>
                <span className={`text-xl font-head font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3d5a7a]" />
              <input
                type="text"
                placeholder="Código, morador, entregador, armário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0f1e35] border border-[#1e3050] rounded-lg pl-8 pr-3 py-2 text-xs text-[#e8f0ff] placeholder-[#3d5a7a] focus:outline-none focus:border-[#00aaff]/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={12} className="text-[#3d5a7a]" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as DeliveryStatus | "all")}
                className="bg-[#0f1e35] border border-[#1e3050] rounded-lg px-2.5 py-2 text-xs text-[#7a9bbf] focus:outline-none cursor-pointer"
              >
                <option value="all">Todos os status</option>
                <option value="Aguardando">Aguardando</option>
                <option value="Atrasado">Atrasado</option>
                <option value="Retirado">Retirado</option>
                <option value="Cancelado">Cancelado</option>
              </select>

              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="bg-[#0f1e35] border border-[#1e3050] rounded-lg px-2.5 py-2 text-xs text-[#7a9bbf] focus:outline-none cursor-pointer"
              >
                <option value="all">Todo período</option>
                <option value="today">Hoje</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mês</option>
              </select>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-[#3d5a7a]">{filtered.length} resultado(s)</span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#0f1e35] border border-[#1e3050] rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1e3050] bg-[#0a1628]">
                  <th className="w-8 py-2.5 px-3" />
                  {[
                    { label: "Código",        field: null },
                    { label: "Morador / Apto",field: null },
                    { label: "Armário",       field: null },
                    { label: "Empresa",       field: null },
                    { label: "Entregador",    field: null },
                    { label: "Chegou em",     field: "arrivedAt" as const },
                    { label: "Espera",        field: "waitTime" as const },
                    { label: "Status",        field: "status" as const },
                  ].map(({ label, field }) => (
                    <th
                      key={label}
                      onClick={() => field && toggleSort(field)}
                      className={`text-left text-[#7a9bbf] font-medium py-2.5 px-3 whitespace-nowrap ${field ? "cursor-pointer hover:text-[#e8f0ff]" : ""}`}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        {field && <ArrowUpDown size={10} className="opacity-40" />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((delivery) => (
                  <>
                    <tr
                      key={delivery.id}
                      className={`border-b border-[#1e3050]/50 hover:bg-[#1a2d50]/40 transition-colors ${STATUS_ROW_ACCENT[delivery.status]}`}
                    >
                      {/* Expand toggle */}
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => setExpandedRow(expandedRow === delivery.id ? null : delivery.id)}
                          className="text-[#3d5a7a] hover:text-[#7a9bbf] transition-colors"
                        >
                          {expandedRow === delivery.id
                            ? <ChevronUp size={12} />
                            : <ChevronDown size={12} />}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#7a9bbf] text-[10px]">{delivery.code}</td>
                      <td className="py-2.5 px-3">
                        <div className="text-[#e8f0ff] font-medium">{delivery.resident}</div>
                        <div className="text-[10px] text-[#3d5a7a]">Apto {delivery.apt}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#e8f0ff]">{delivery.locker}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-medium ${COMPANY_COLORS[delivery.company] ?? "bg-[#1a2d50] text-[#7a9bbf]"}`}>
                          {delivery.company}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#7a9bbf]">{delivery.courier}</td>
                      <td className="py-2.5 px-3 text-[#7a9bbf] font-mono">{delivery.arrivedAt}</td>
                      <td className="py-2.5 px-3">
                        <span className={delivery.status === "Atrasado" ? "text-[#ff4d6a] font-semibold" : "text-[#7a9bbf]"}>
                          {delivery.waitTime}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_BADGE[delivery.status]}`}>
                          {delivery.status}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {expandedRow === delivery.id && (
                      <tr key={`${delivery.id}-expanded`} className="bg-[#0a1628]/60 border-b border-[#1e3050]/50">
                        <td colSpan={9} className="px-6 py-3">
                          <div className="flex gap-6 text-xs">
                            {delivery.notes && (
                              <div className="flex items-start gap-2">
                                <AlertTriangle size={11} className="text-[#ffa62b] mt-0.5 flex-shrink-0" />
                                <span className="text-[#ffa62b]">{delivery.notes}</span>
                              </div>
                            )}
                            {delivery.retrievedAt && (
                              <div className="flex items-center gap-2">
                                <CheckCircle size={11} className="text-[#00c88c]" />
                                <span className="text-[#7a9bbf]">Retirado em: <span className="font-mono text-[#e8f0ff]">{delivery.retrievedAt}</span></span>
                              </div>
                            )}
                            <button
                              onClick={() => setSelectedDelivery(delivery)}
                              className="ml-auto text-[#00aaff] hover:underline flex items-center gap-1"
                            >
                              <Eye size={11} /> Ver linha do tempo completa
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-12">
                <Package size={24} className="text-[#3d5a7a]" />
                <span className="text-sm text-[#7a9bbf]">Nenhuma entrega encontrada</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer */}
      {selectedDelivery && (
        <DeliveryDrawer delivery={selectedDelivery} onClose={() => setSelectedDelivery(null)} />
      )}

      {/* Register modal */}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  );
}