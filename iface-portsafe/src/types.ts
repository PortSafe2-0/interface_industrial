export type LockerStatus = "empty" | "occupied" | "error" | "overdue" | "freed";

export interface Locker {
  id: string;
  number: string;
  status: LockerStatus;
  resident?: string;
  apt?: string;
  waitTime?: string;
}

export interface Delivery {
  id: string;
  locker: string;
  resident: string;
  courier: string;
  arrivedAt: string;
  waitTime: string;
  status: "Ocupado" | "Atrasado" | "Retirado";
}

export interface Alert {
  id: string;
  message: string;
  time: string;
  resolved: boolean;
}

export interface FeedEvent {
  id: string;
  icon: "locker" | "delivery" | "sensor";
  message: string;
  time: string;
}

export interface KPI {
  deliveriesToday: number;
  deliveriesYesterday: number;
  lockersOccupied: number;
  lockersTotal: number;
  overdue: number;
  activeAlerts: number;
  lastAlertMsg: string;
}
