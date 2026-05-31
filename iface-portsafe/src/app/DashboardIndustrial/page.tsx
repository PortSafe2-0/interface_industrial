"use client";
import { useEffect, useState } from "react";
import { Zap, CheckCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import KPICards from "@/components/KPICards";
import LockerMap from "@/components/LockerMap";
import DeliveryChart from "@/components/DeliveryChart";
import DeliveriesTable from "@/components/DeliveriesTable";
import AlertsPanel from "@/components/AlertsPanel";
import { mockAlerts, mockFeed } from "@/mock-data";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { lockerService, deliveryService, kpiService, chartService } from "@/services/api";
import type { KPI } from "@/types";

export default function Dashboard() {
  const [time, setTime] = useState("");
  const { user, isLoading } = useProtectedRoute();
  const [lockers, setLockers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [chartData, setChartData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lockersData, deliveriesData, kpiData, chartDataResult] = await Promise.all([
          lockerService.getAll(),
          deliveryService.getAll(),
          kpiService.calculate(),
          chartService.getDeliveryData(),
        ]);
        setLockers(lockersData);
        setDeliveries(deliveriesData);
        setKpi(kpiData as KPI);
        setChartData(chartDataResult);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setDataLoading(false);
      }
    };

    if (!isLoading) {
      fetchData();
    }
  }, [isLoading]);

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString("pt-BR", { hour12: false }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-r from-[#002236] via-black to-[#002134]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 rounded-full border-4 border-[#1e3050] border-t-[#00aaff] animate-spin mb-4"></div>
          <p className="text-[#7a9bbf] text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-r from-[#002236] via-black to-[#002134]">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 bg-[#0a1628] border-b border-[#1e3050] px-6 py-3"> 
          <div className="flex items-center justify-between">
            <div className="mt-4 mb-4 ml-4">
              <h1 className="font-head font-bold text-4xl text-[#e8f0ff] tracking-wide">Painel Operacional</h1>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-[#B3D6FD] font-mono">{time || "00:00:00"}</span>
                <span className="text-[#3d5a7a]">|</span>
                <span className="text-xs text-[#B3D6FD]">Vista Verde</span>
                <span className="text-[#3d5a7a]">|</span>
                <div className="flex items-center gap-1.5">
                  <Zap size={11} className="text-[#00c88c]" />
                  <span className="text-xs text-[#B3D6FD]">MQTT:</span>
                  <span className="text-xs text-[#00c88c] font-extrabold">Conectado</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00c88c] pulse-dot" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-[#00c88c]" />
              <span className="text-xs text-[#00c88c] font-extrabold">Todos os sistemas operacionais</span>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {kpi && <KPICards kpi={kpi} />}
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3"><LockerMap lockers={lockers} /></div>
            <div className="col-span-2"><DeliveryChart data={chartData} /></div>
          </div>
          <DeliveriesTable deliveries={deliveries} />
        </div>
      </div>
    </div>
  );
}