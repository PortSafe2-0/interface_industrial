"use client";

import { useState, useMemo } from "react";
import {
  Search, Filter, Users, UserPlus, X, Pencil, MoreHorizontal,
  Eye, MapPin, Phone, Mail, Package, Clock, CheckCircle,
  ArrowUpDown, Download, Shield, ShieldOff, AlertTriangle,
  ChevronDown, ChevronUp, Archive,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

// ── Types ──────────────────────────────────────────────────────────────────
type ResidentStatus = "Ativo" | "Inativo" | "Bloqueado";

interface Resident {
  id: string;
  name: string;
  apt: string;
  block: string;
  floor: number;
  phone: string;
  email: string;
  status: ResidentStatus;
  since: string;
  deliveries: number;
  pendingDeliveries: number;
  lastDelivery?: string;
  cpf: string;
  notes?: string;
}

interface DeliveryRecord {
  id: string;
  code: string;
  locker: string;
  company: string;
  arrivedAt: string;
  retrievedAt?: string;
  status: "Retirado" | "Aguardando" | "Atrasado" | "Cancelado";
}

// ── Mock data ──────────────────────────────────────────────────────────────
const RESIDENTS: Resident[] = [
  { id:"1",  name:"Ana Oliveira",    apt:"102B", block:"A", floor:1, phone:"(11) 98765-4321", email:"ana.oliveira@email.com",    status:"Ativo",    since:"Jan 2021", deliveries:47, pendingDeliveries:1, lastDelivery:"22/11/2022", cpf:"123.456.789-00" },
  { id:"2",  name:"Carlos Lima",     apt:"204A", block:"A", floor:2, phone:"(11) 97654-3210", email:"carlos.lima@email.com",     status:"Ativo",    since:"Mar 2020", deliveries:32, pendingDeliveries:1, lastDelivery:"22/11/2022", cpf:"234.567.890-11" },
  { id:"3",  name:"Fernanda Costa",  apt:"301",  block:"B", floor:3, phone:"(11) 96543-2109", email:"fernanda.costa@email.com",  status:"Ativo",    since:"Jun 2022", deliveries:18, pendingDeliveries:1, lastDelivery:"22/11/2022", cpf:"345.678.901-22" },
  { id:"4",  name:"Rafael Torres",   apt:"105",  block:"A", floor:1, phone:"(11) 95432-1098", email:"rafael.torres@email.com",   status:"Ativo",    since:"Ago 2019", deliveries:61, pendingDeliveries:1, lastDelivery:"22/11/2022", cpf:"456.789.012-33" },
  { id:"5",  name:"Marcos Souza",    apt:"407",  block:"B", floor:4, phone:"(11) 94321-0987", email:"marcos.souza@email.com",    status:"Ativo",    since:"Nov 2021", deliveries:29, pendingDeliveries:0, lastDelivery:"20/11/2022", cpf:"567.890.123-44", notes:"Preferência de notificação por SMS" },
  { id:"6",  name:"Patrícia Nunes",  apt:"203",  block:"A", floor:2, phone:"(11) 93210-9876", email:"patricia.nunes@email.com",  status:"Ativo",    since:"Fev 2020", deliveries:54, pendingDeliveries:1, lastDelivery:"22/11/2022", cpf:"678.901.234-55" },
  { id:"7",  name:"Luiz Henrique",   apt:"110",  block:"A", floor:1, phone:"(11) 92109-8765", email:"luiz.henrique@email.com",   status:"Ativo",    since:"Abr 2021", deliveries:23, pendingDeliveries:0, lastDelivery:"21/11/2022", cpf:"789.012.345-66" },
  { id:"8",  name:"Juliana Alves",   apt:"502",  block:"C", floor:5, phone:"(11) 91098-7654", email:"juliana.alves@email.com",   status:"Ativo",    since:"Set 2018", deliveries:88, pendingDeliveries:1, lastDelivery:"21/11/2022", cpf:"890.123.456-77", notes:"Entrega +24h pendente — notificar portaria" },
  { id:"9",  name:"Roberto Melo",    apt:"308",  block:"B", floor:3, phone:"(11) 90987-6543", email:"roberto.melo@email.com",    status:"Ativo",    since:"Jul 2022", deliveries:11, pendingDeliveries:1, lastDelivery:"21/11/2022", cpf:"901.234.567-88" },
  { id:"10", name:"Camila Reis",     apt:"401",  block:"B", floor:4, phone:"(11) 89876-5432", email:"camila.reis@email.com",     status:"Ativo",    since:"Jan 2023", deliveries:7,  pendingDeliveries:1, lastDelivery:"22/11/2022", cpf:"012.345.678-99" },
  { id:"11", name:"Diego Faria",     apt:"206",  block:"A", floor:2, phone:"(11) 88765-4321", email:"diego.faria@email.com",     status:"Ativo",    since:"Out 2020", deliveries:39, pendingDeliveries:1, lastDelivery:"22/11/2022", cpf:"111.222.333-44" },
  { id:"12", name:"Marina Castro",   apt:"503",  block:"C", floor:5, phone:"(11) 87654-3210", email:"marina.castro@email.com",   status:"Inativo",  since:"Mai 2019", deliveries:72, pendingDeliveries:0, lastDelivery:"10/10/2022", cpf:"222.333.444-55", notes:"Moradora temporariamente ausente" },
  { id:"13", name:"Felipe Duarte",   apt:"104",  block:"A", floor:1, phone:"(11) 86543-2109", email:"felipe.duarte@email.com",   status:"Bloqueado",since:"Dez 2021", deliveries:15, pendingDeliveries:0, lastDelivery:"05/09/2022", cpf:"333.444.555-66", notes:"Acesso bloqueado — pendência administrativa" },
  { id:"14", name:"Beatriz Santos",  apt:"302",  block:"B", floor:3, phone:"(11) 85432-1098", email:"beatriz.santos@email.com",  status:"Ativo",    since:"Mar 2022", deliveries:21, pendingDeliveries:0, lastDelivery:"18/11/2022", cpf:"444.555.666-77" },
];

const RESIDENT_DELIVERIES: DeliveryRecord[] = [
  { id:"1", code:"PS-20221122-001", locker:"03", company:"Correios",      arrivedAt:"22/11/2022 13:17", status:"Aguardando" },
  { id:"2", code:"PS-20221118-001", locker:"05", company:"Shopee",        arrivedAt:"18/11/2022 09:30", retrievedAt:"18/11/2022 12:00", status:"Retirado" },
  { id:"3", code:"PS-20221110-003", locker:"12", company:"Amazon",        arrivedAt:"10/11/2022 14:00", retrievedAt:"10/11/2022 19:30", status:"Retirado" },
  { id:"4", code:"PS-20221101-002", locker:"08", company:"Mercado Livre", arrivedAt:"01/11/2022 10:00", retrievedAt:"01/11/2022 16:00", status:"Retirado" },
  { id:"5", code:"PS-20221020-001", locker:"15", company:"Correios",      arrivedAt:"20/10/2022 09:00", retrievedAt:"21/10/2022 08:00", status:"Retirado" },
];

// ── Style maps ─────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<ResidentStatus, string> = {
  Ativo:     "bg-[#00c88c]/15 text-[#00c88c] border border-[#00c88c]/30",
  Inativo:   "bg-[#7a9bbf]/15 text-[#7a9bbf] border border-[#3d5a7a]/30",
  Bloqueado: "bg-[#ff4d6a]/15 text-[#ff4d6a] border border-[#ff4d6a]/30",
};

const DELIVERY_BADGE: Record<string, string> = {
  Retirado:   "bg-[#00c88c]/15 text-[#00c88c]",
  Aguardando: "bg-[#00aaff]/15 text-[#00aaff]",
  Atrasado:   "bg-[#ff4d6a]/15 text-[#ff4d6a]",
  Cancelado:  "bg-[#3d5a7a]/20 text-[#7a9bbf]",
};

const COMPANY_COLOR: Record<string, string> = {
  "Correios":      "text-[#ffa62b]",
  "Mercado Livre": "text-[#ffd700]",
  "Amazon":        "text-[#00aaff]",
  "Shopee":        "text-[#ff4d6a]",
};

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const AVATAR_COLORS = [
  "bg-[#00aaff]/20 text-[#00aaff]",
  "bg-[#00c88c]/20 text-[#00c88c]",
  "bg-[#d2a8ff]/20 text-[#d2a8ff]",
  "bg-[#ffa62b]/20 text-[#ffa62b]",
  "bg-[#ff4d6a]/20 text-[#ff4d6a]",
];

// ── Resident Drawer ────────────────────────────────────────────────────────
function ResidentDrawer({
  resident, onClose,
}: {
  resident: Resident;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"info" | "deliveries">("info");
  const avatarColor = AVATAR_COLORS[parseInt(resident.id) % AVATAR_COLORS.length];

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[400px] h-full bg-[#0a1628] border-l border-[#1e3050] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="px-5 py-5 border-b border-[#1e3050]">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-head font-bold text-lg ${avatarColor}`}>
                {initials(resident.name)}
              </div>
              <div>
                <div className="font-head font-bold text-[#e8f0ff] text-base tracking-wide">{resident.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin size={10} className="text-[#3d5a7a]" />
                  <span className="text-xs text-[#7a9bbf]">Apto {resident.apt} — Bloco {resident.block}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-[#3d5a7a] hover:text-[#7a9bbf] mt-1"><X size={16} /></button>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[resident.status]}`}>
              {resident.status}
            </span>
            <span className="text-[10px] text-[#3d5a7a]">Morador desde {resident.since}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1e3050]">
          {(["info", "deliveries"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-head font-semibold tracking-wide transition-colors ${
                tab === t
                  ? "text-[#00aaff] border-b-2 border-[#00aaff]"
                  : "text-[#7a9bbf] hover:text-[#e8f0ff]"
              }`}
            >
              {t === "info" ? "Informações" : `Histórico de Entregas (${resident.deliveries})`}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {tab === "info" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Entregas",  value: resident.deliveries,        color: "text-[#e8f0ff]" },
                  { label: "Pendentes", value: resident.pendingDeliveries,  color: resident.pendingDeliveries > 0 ? "text-[#ffa62b]" : "text-[#00c88c]" },
                  { label: "Andar",     value: `${resident.floor}º`,        color: "text-[#e8f0ff]" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-[#0f1e35] border border-[#1e3050] rounded-xl p-3 text-center">
                    <div className={`text-xl font-head font-bold ${color}`}>{value}</div>
                    <div className="text-[10px] text-[#3d5a7a] mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="bg-[#0f1e35] border border-[#1e3050] rounded-xl p-4 space-y-3">
                <div className="text-[10px] text-[#3d5a7a] uppercase tracking-wide">Contato</div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone size={12} className="text-[#3d5a7a] flex-shrink-0" />
                  <span className="text-[#e8f0ff]">{resident.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail size={12} className="text-[#3d5a7a] flex-shrink-0" />
                  <span className="text-[#7a9bbf] text-xs">{resident.email}</span>
                </div>
              </div>

              {/* Personal */}
              <div className="bg-[#0f1e35] border border-[#1e3050] rounded-xl p-4 space-y-2">
                <div className="text-[10px] text-[#3d5a7a] uppercase tracking-wide mb-2">Dados cadastrais</div>
                {[
                  { label: "CPF",         value: resident.cpf },
                  { label: "Apartamento", value: resident.apt },
                  { label: "Bloco",       value: resident.block },
                  { label: "Andar",       value: `${resident.floor}º` },
                  { label: "Desde",       value: resident.since },
                  { label: "Última entrega", value: resident.lastDelivery ?? "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-[#7a9bbf]">{label}</span>
                    <span className="text-[#e8f0ff] font-medium">{value}</span>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {resident.notes && (
                <div className="bg-[#ffa62b]/5 border border-[#ffa62b]/20 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle size={11} className="text-[#ffa62b]" />
                    <span className="text-[10px] text-[#ffa62b] uppercase tracking-wide">Observação</span>
                  </div>
                  <p className="text-xs text-[#e8f0ff]">{resident.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <div className="text-[10px] text-[#3d5a7a] uppercase tracking-wide">Ações</div>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#00aaff]/10 border border-[#00aaff]/30 text-[#00aaff] text-sm hover:bg-[#00aaff]/20 transition-colors">
                  <Pencil size={13} /> Editar cadastro
                </button>
                {resident.status === "Ativo" ? (
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#ff4d6a]/10 border border-[#ff4d6a]/30 text-[#ff4d6a] text-sm hover:bg-[#ff4d6a]/20 transition-colors">
                    <ShieldOff size={13} /> Bloquear acesso
                  </button>
                ) : (
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#00c88c]/10 border border-[#00c88c]/30 text-[#00c88c] text-sm hover:bg-[#00c88c]/20 transition-colors">
                    <Shield size={13} /> Reativar acesso
                  </button>
                )}
              </div>
            </>
          )}

          {tab === "deliveries" && (
            <div className="space-y-2">
              {RESIDENT_DELIVERIES.map((d) => (
                <div key={d.id} className="bg-[#0f1e35] border border-[#1e3050] rounded-xl p-3">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono text-[10px] text-[#3d5a7a]">{d.code}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${DELIVERY_BADGE[d.status]}`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Archive size={10} className="text-[#3d5a7a]" />
                      <span className="text-[#7a9bbf]">Armário</span>
                      <span className="text-[#e8f0ff] font-mono font-bold ml-auto">{d.locker}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Package size={10} className="text-[#3d5a7a]" />
                      <span className={`text-[10px] font-medium ${COMPANY_COLOR[d.company] ?? "text-[#7a9bbf]"}`}>{d.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Clock size={10} className="text-[#3d5a7a]" />
                      <span className="text-[#7a9bbf]">Chegou em</span>
                      <span className="text-[#e8f0ff] font-mono text-[10px] ml-auto">{d.arrivedAt}</span>
                    </div>
                    {d.retrievedAt && (
                      <div className="flex items-center gap-1.5 col-span-2">
                        <CheckCircle size={10} className="text-[#00c88c]" />
                        <span className="text-[#7a9bbf]">Retirado em</span>
                        <span className="text-[#00c88c] font-mono text-[10px] ml-auto">{d.retrievedAt}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Register Modal ─────────────────────────────────────────────────────────
function RegisterModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1e35] border border-[#1e3050] rounded-2xl p-6 w-[440px] shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <span className="font-head font-bold text-lg text-[#e8f0ff] tracking-wide">Cadastrar Morador</span>
          <button onClick={onClose} className="text-[#3d5a7a] hover:text-[#7a9bbf]"><X size={16} /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Nome completo",    placeholder: "Nome do morador",   col: "col-span-2" },
            { label: "CPF",             placeholder: "000.000.000-00",     col: "" },
            { label: "Telefone",        placeholder: "(11) 99999-9999",    col: "" },
            { label: "E-mail",          placeholder: "email@exemplo.com",  col: "col-span-2" },
            { label: "Apartamento",     placeholder: "Ex: 102B",           col: "" },
            { label: "Bloco",           placeholder: "Ex: A",              col: "" },
          ].map(({ label, placeholder, col }) => (
            <div key={label} className={col}>
              <label className="text-[10px] text-[#7a9bbf] uppercase tracking-wide block mb-1">{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                className="w-full bg-[#0a1628] border border-[#1e3050] rounded-lg px-3 py-2 text-sm text-[#e8f0ff] placeholder-[#3d5a7a] focus:outline-none focus:border-[#00aaff]/50"
              />
            </div>
          ))}

          <div className="col-span-2">
            <label className="text-[10px] text-[#7a9bbf] uppercase tracking-wide block mb-1">Observações (opcional)</label>
            <textarea
              placeholder="Observações sobre o morador..."
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
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function MoradoresPage() {
  const [search, setSearch]               = useState("");
  const [filterStatus, setFilterStatus]   = useState<ResidentStatus | "all">("all");
  const [filterBlock, setFilterBlock]     = useState("all");
  const [filterFloor, setFilterFloor]     = useState("all");
  const [sortField, setSortField]         = useState<"name" | "apt" | "deliveries">("name");
  const [sortAsc, setSortAsc]             = useState(true);
  const [view, setView]                   = useState<"grid" | "table">("table");
  const [selectedResident, setSelected]   = useState<Resident | null>(null);
  const [showRegister, setShowRegister]   = useState(false);
  const [expandedRow, setExpandedRow]     = useState<string | null>(null);

  const blocks = useMemo(() => [...new Set(RESIDENTS.map((r) => r.block))].sort(), []);
  const floors  = useMemo(() => [...new Set(RESIDENTS.map((r) => r.floor))].sort((a, b) => a - b), []);

  const filtered = useMemo(() => {
    return RESIDENTS.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.apt.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.cpf.includes(search);
      const matchStatus = filterStatus === "all" || r.status === filterStatus;
      const matchBlock  = filterBlock  === "all" || r.block  === filterBlock;
      const matchFloor  = filterFloor  === "all" || String(r.floor) === filterFloor;
      return matchSearch && matchStatus && matchBlock && matchFloor;
    }).sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      if (sortField === "name")       return dir * a.name.localeCompare(b.name);
      if (sortField === "apt")        return dir * a.apt.localeCompare(b.apt);
      if (sortField === "deliveries") return dir * (a.deliveries - b.deliveries);
      return 0;
    });
  }, [search, filterStatus, filterBlock, filterFloor, sortField, sortAsc]);

  const counts = useMemo(() => ({
    total:     RESIDENTS.length,
    ativos:    RESIDENTS.filter((r) => r.status === "Ativo").length,
    inativos:  RESIDENTS.filter((r) => r.status === "Inativo").length,
    bloqueados:RESIDENTS.filter((r) => r.status === "Bloqueado").length,
    pendentes: RESIDENTS.filter((r) => r.pendingDeliveries > 0).length,
  }), []);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060d18]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-[#0a1628] border-b border-[#1e3050] px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-head font-bold text-2xl text-[#e8f0ff] tracking-wide">Moradores</h1>
              <p className="text-xs text-[#7a9bbf] mt-0.5">Gestão de moradores e histórico de entregas</p>
            </div>
            <button
              onClick={() => setShowRegister(true)}
              className="flex items-center gap-2 bg-[#00aaff] hover:opacity-90 transition-opacity text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              <UserPlus size={14} /> Cadastrar morador
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          {/* KPIs */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "Total",       value: counts.total,      color: "text-[#e8f0ff]", border: "" },
              { label: "Ativos",      value: counts.ativos,     color: "text-[#00c88c]", border: "border-[#00c88c]/20" },
              { label: "Inativos",    value: counts.inativos,   color: "text-[#7a9bbf]", border: "" },
              { label: "Bloqueados",  value: counts.bloqueados, color: "text-[#ff4d6a]", border: "border-[#ff4d6a]/20" },
              { label: "Com pendência",value: counts.pendentes, color: "text-[#ffa62b]", border: "border-[#ffa62b]/20" },
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
                placeholder="Nome, apartamento, e-mail, CPF..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0f1e35] border border-[#1e3050] rounded-lg pl-8 pr-3 py-2 text-xs text-[#e8f0ff] placeholder-[#3d5a7a] focus:outline-none focus:border-[#00aaff]/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={12} className="text-[#3d5a7a]" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as ResidentStatus | "all")}
                className="bg-[#0f1e35] border border-[#1e3050] rounded-lg px-2.5 py-2 text-xs text-[#7a9bbf] focus:outline-none cursor-pointer">
                <option value="all">Todos os status</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Bloqueado">Bloqueado</option>
              </select>

              <select value={filterBlock} onChange={(e) => setFilterBlock(e.target.value)}
                className="bg-[#0f1e35] border border-[#1e3050] rounded-lg px-2.5 py-2 text-xs text-[#7a9bbf] focus:outline-none cursor-pointer">
                <option value="all">Todos os blocos</option>
                {blocks.map((b) => <option key={b} value={b}>Bloco {b}</option>)}
              </select>

              <select value={filterFloor} onChange={(e) => setFilterFloor(e.target.value)}
                className="bg-[#0f1e35] border border-[#1e3050] rounded-lg px-2.5 py-2 text-xs text-[#7a9bbf] focus:outline-none cursor-pointer">
                <option value="all">Todos os andares</option>
                {floors.map((f) => <option key={f} value={String(f)}>{f}º Andar</option>)}
              </select>
            </div>

            {/* View toggle */}
            <div className="flex bg-[#0f1e35] border border-[#1e3050] rounded-lg overflow-hidden">
              {(["table", "grid"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-xs font-head font-semibold tracking-wide transition-colors ${
                    view === v ? "bg-[#00aaff]/15 text-[#00aaff]" : "text-[#7a9bbf] hover:text-[#e8f0ff]"
                  }`}>
                  {v === "table" ? "Tabela" : "Cards"}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-[#3d5a7a]">{filtered.length} morador(es)</span>
              <button className="flex items-center gap-1.5 bg-[#0f1e35] border border-[#1e3050] text-[#7a9bbf] text-xs px-3 py-2 rounded-lg hover:text-[#e8f0ff] transition-colors">
                <Download size={12} /> Exportar
              </button>
            </div>
          </div>

          {/* Table view */}
          {view === "table" && (
            <div className="bg-[#0f1e35] border border-[#1e3050] rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#1e3050] bg-[#0a1628]">
                    <th className="w-8 py-2.5 px-3" />
                    {[
                      { label: "Morador",   field: "name" as const },
                      { label: "Apto / Bloco", field: "apt" as const },
                      { label: "Contato",   field: null },
                      { label: "Entregas",  field: "deliveries" as const },
                      { label: "Pendentes", field: null },
                      { label: "Última entrega", field: null },
                      { label: "Status",    field: null },
                      { label: "Ações",     field: null },
                    ].map(({ label, field }) => (
                      <th key={label} onClick={() => field && toggleSort(field)}
                        className={`text-left text-[#7a9bbf] font-medium py-2.5 px-3 whitespace-nowrap ${field ? "cursor-pointer hover:text-[#e8f0ff]" : ""}`}>
                        <div className="flex items-center gap-1">
                          {label}
                          {field && <ArrowUpDown size={10} className="opacity-40" />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((resident) => {
                    const avatarColor = AVATAR_COLORS[parseInt(resident.id) % AVATAR_COLORS.length];
                    const isExpanded = expandedRow === resident.id;
                    return (
                      <>
                        <tr key={resident.id}
                          className={`border-b border-[#1e3050]/50 hover:bg-[#1a2d50]/40 transition-colors ${
                            resident.status === "Bloqueado" ? "opacity-60" : ""
                          }`}>
                          <td className="py-2.5 px-3">
                            <button onClick={() => setExpandedRow(isExpanded ? null : resident.id)}
                              className="text-[#3d5a7a] hover:text-[#7a9bbf] transition-colors">
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-head font-bold text-[10px] flex-shrink-0 ${avatarColor}`}>
                                {initials(resident.name)}
                              </div>
                              <span className="text-[#e8f0ff] font-medium">{resident.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="text-[#e8f0ff] font-mono font-bold">{resident.apt}</div>
                            <div className="text-[10px] text-[#3d5a7a]">Bloco {resident.block} · {resident.floor}º Andar</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="text-[#7a9bbf]">{resident.phone}</div>
                            <div className="text-[10px] text-[#3d5a7a]">{resident.email}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[#e8f0ff] font-head font-bold text-base">{resident.deliveries}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            {resident.pendingDeliveries > 0 ? (
                              <span className="bg-[#ffa62b]/15 text-[#ffa62b] text-[10px] px-2 py-0.5 rounded-full font-medium">
                                {resident.pendingDeliveries} pendente{resident.pendingDeliveries > 1 ? "s" : ""}
                              </span>
                            ) : (
                              <span className="text-[#3d5a7a] text-[10px]">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-[#7a9bbf] font-mono text-[10px]">
                            {resident.lastDelivery ?? "—"}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_BADGE[resident.status]}`}>
                              {resident.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2 text-[#3d5a7a]">
                              <button onClick={() => setSelected(resident)} className="hover:text-[#00aaff] transition-colors" title="Ver detalhes">
                                <Eye size={12} />
                              </button>
                              <button className="hover:text-[#00aaff] transition-colors" title="Editar">
                                <Pencil size={12} />
                              </button>
                              <button className="hover:text-[#00aaff] transition-colors" title="Mais">
                                <MoreHorizontal size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr key={`${resident.id}-exp`} className="bg-[#0a1628]/60 border-b border-[#1e3050]/50">
                            <td colSpan={9} className="px-6 py-3">
                              <div className="flex items-center gap-6 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <Mail size={11} className="text-[#3d5a7a]" />
                                  <span className="text-[#7a9bbf]">{resident.email}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Users size={11} className="text-[#3d5a7a]" />
                                  <span className="text-[#7a9bbf]">CPF: <span className="text-[#e8f0ff] font-mono">{resident.cpf}</span></span>
                                </div>
                                {resident.notes && (
                                  <div className="flex items-center gap-1.5">
                                    <AlertTriangle size={11} className="text-[#ffa62b]" />
                                    <span className="text-[#ffa62b]">{resident.notes}</span>
                                  </div>
                                )}
                                <button onClick={() => setSelected(resident)}
                                  className="ml-auto text-[#00aaff] hover:underline flex items-center gap-1">
                                  <Eye size={11} /> Ver histórico completo
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-12">
                  <Users size={24} className="text-[#3d5a7a]" />
                  <span className="text-sm text-[#7a9bbf]">Nenhum morador encontrado</span>
                </div>
              )}
            </div>
          )}

          {/* Cards view */}
          {view === "grid" && (
            <div className="grid grid-cols-3 gap-4">
              {filtered.map((resident) => {
                const avatarColor = AVATAR_COLORS[parseInt(resident.id) % AVATAR_COLORS.length];
                return (
                  <div key={resident.id}
                    onClick={() => setSelected(resident)}
                    className={`bg-[#0f1e35] border border-[#1e3050] rounded-xl p-4 cursor-pointer hover:bg-[#1a2d50]/60 hover:border-[#3d5a7a] transition-all ${
                      resident.status === "Bloqueado" ? "opacity-60" : ""
                    }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-head font-bold text-sm ${avatarColor}`}>
                          {initials(resident.name)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#e8f0ff]">{resident.name}</div>
                          <div className="text-[10px] text-[#7a9bbf]">Apto {resident.apt} · Bloco {resident.block}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_BADGE[resident.status]}`}>
                        {resident.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { label: "Entregas", value: resident.deliveries,       color: "text-[#e8f0ff]" },
                        { label: "Pendentes",value: resident.pendingDeliveries, color: resident.pendingDeliveries > 0 ? "text-[#ffa62b]" : "text-[#00c88c]" },
                        { label: "Andar",    value: `${resident.floor}º`,       color: "text-[#e8f0ff]" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="bg-[#0a1628] rounded-lg p-2 text-center">
                          <div className={`text-base font-head font-bold ${color}`}>{value}</div>
                          <div className="text-[9px] text-[#3d5a7a] mt-0.5">{label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <Phone size={9} className="text-[#3d5a7a]" />
                        <span className="text-[#7a9bbf]">{resident.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <Clock size={9} className="text-[#3d5a7a]" />
                        <span className="text-[#7a9bbf]">Última entrega: {resident.lastDelivery ?? "—"}</span>
                      </div>
                    </div>

                    {resident.notes && (
                      <div className="mt-2 flex items-start gap-1.5">
                        <AlertTriangle size={9} className="text-[#ffa62b] mt-0.5 flex-shrink-0" />
                        <span className="text-[9px] text-[#ffa62b] line-clamp-1">{resident.notes}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedResident && (
        <ResidentDrawer resident={selectedResident} onClose={() => setSelected(null)} />
      )}

      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  );
}