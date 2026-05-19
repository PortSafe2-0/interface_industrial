import { Locker, Delivery, Alert, FeedEvent, KPI } from "@/types";

export const mockKPI: KPI = {
  deliveriesToday: 23,
  deliveriesYesterday: 19,
  lockersOccupied: 12,
  lockersTotal: 20,
  overdue: 3,
  activeAlerts: 2,
  lastAlertMsg: "Porta aberta há 4 min",
};

export const mockLockers: Locker[] = [
  { id: "1",  number: "01", status: "empty" },
  { id: "2",  number: "02", status: "empty" },
  { id: "3",  number: "03", status: "occupied", resident: "Ana Oliveira", apt: "102B", waitTime: "5h" },
  { id: "4",  number: "04", status: "occupied", resident: "Carlos Lima", apt: "204A", waitTime: "2h" },
  { id: "5",  number: "05", status: "occupied", resident: "Fernanda Costa", apt: "301", waitTime: "1h" },
  { id: "6",  number: "06", status: "occupied", resident: "Rafael Torres", apt: "105", waitTime: "3h" },
  { id: "7",  number: "07", status: "error", resident: "Marcos Souza", apt: "407", waitTime: "4h" },
  { id: "8",  number: "08", status: "empty" },
  { id: "9",  number: "09", status: "empty" },
  { id: "10", number: "10", status: "occupied", resident: "Patrícia Nunes", apt: "203", waitTime: "6h" },
  { id: "11", number: "11", status: "error", resident: "Luiz Henrique", apt: "110", waitTime: "30min" },
  { id: "12", number: "12", status: "empty" },
  { id: "13", number: "13", status: "overdue", resident: "Juliana Alves", apt: "502", waitTime: "28h" },
  { id: "14", number: "14", status: "overdue", resident: "Roberto Melo", apt: "308", waitTime: "26h" },
  { id: "15", number: "15", status: "empty" },
  { id: "16", number: "16", status: "empty" },
  { id: "17", number: "17", status: "occupied", resident: "Camila Reis", apt: "401", waitTime: "45min" },
  { id: "18", number: "18", status: "occupied", resident: "Diego Faria", apt: "206", waitTime: "1h" },
  { id: "19", number: "19", status: "freed" },
  { id: "20", number: "20", status: "empty" },
];

export const mockDeliveries: Delivery[] = [
  { id: "1", locker: "01",  resident: "Ana Oliveira",    courier: "João Silva",    arrivedAt: "22/11/2022 13:17", waitTime: "5h",  status: "Ocupado"  },
  { id: "2", locker: "102B",resident: "Morador: Oliveira",courier: "Rosa Estandor",arrivedAt: "12/01/2022 17:36", waitTime: "5h",  status: "Atrasado" },
  { id: "3", locker: "02",  resident: "Ana Oliveira",    courier: "Anna Estaniha", arrivedAt: "17/11/2022 17:58", waitTime: "5h",  status: "Atrasado" },
  { id: "4", locker: "05",  resident: "Fernanda Costa",  courier: "Pedro Alves",   arrivedAt: "23/11/2022 09:00", waitTime: "2h",  status: "Ocupado"  },
  { id: "5", locker: "17",  resident: "Camila Reis",     courier: "Lucas Moura",   arrivedAt: "23/11/2022 11:30", waitTime: "45min",status: "Ocupado"  },
];

export const mockAlerts: Alert[] = [
  { id: "1", message: "Armário 07 — porta aberta há 4 min", time: "12:38:35", resolved: false },
  { id: "2", message: "Armário 07 — porta aberta há 4 min", time: "07:08 AM", resolved: false },
  { id: "3", message: "Armário 07 — porta aberta há 4 min", time: "07:38 AM", resolved: false },
  { id: "4", message: "Armário 07 — porta aberta há 4 min", time: "07:53 AM", resolved: false },
];

export const mockFeed: FeedEvent[] = [
  { id: "1",  icon: "locker",   message: "Armário 03 aberto por João Silva",   time: "1:53 AM" },
  { id: "2",  icon: "delivery", message: "Entrega registrada no Armário 12",   time: "1:53 AM" },
  { id: "3",  icon: "delivery", message: "Entrega registrada no Armário 12",   time: "1:52 AM" },
  { id: "4",  icon: "delivery", message: "Entrega registrada no Armário 12",   time: "1:33 AM" },
  { id: "5",  icon: "locker",   message: "Armário 03 aberto por João Silva",   time: "07:38 AM" },
  { id: "6",  icon: "delivery", message: "Entrega registrada no Armário 12",   time: "7:00 AM" },
  { id: "7",  icon: "sensor",   message: "ESP32-04 reconectado",               time: "6:55 AM" },
  { id: "8",  icon: "delivery", message: "Entrega registrada no Armário 12",   time: "07:33 AM" },
];

export const mockChartData = [
  { day: "Mon", value: 8  },
  { day: "Tue", value: 14 },
  { day: "Wed", value: 11 },
  { day: "Thu", value: 19 },
  { day: "Fri", value: 23, today: true },
  { day: "Sat", value: 16 },
  { day: "Sun", value: 6  },
];
