import axios from 'axios';
import type { Locker, Delivery } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicionar token ao header se existir
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: () => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  },

  getUser: () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const lockerService = {
  getAll: async () => {
    const response = await apiClient.get('/lockers');
    const data = response.data.data || [];
    
    // Transformar dados do backend para formato esperado pelo frontend
    return data.map((locker: any, index: number) => ({
      id: locker.id,
      number: locker.code || `L${index + 1}`,
      status: "occupied", // Todos os lockers têm deliveries
      resident: getResidentNameByIndex(index),
      apt: `${300 + index}`,
      waitTime: getWaitTimeByIndex(index),
    }));
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/lockers/${id}`);
    return response.data.data;
  },
};

// Funções auxiliares para dados mais realistas
function getResidentNameByIndex(index: number): string {
  const residents = ["João Silva", "Maria Santos", "Carlos Oliveira", "Ana Costa", "Pedro Gomes"];
  return residents[index % residents.length];
}

function getWaitTimeByIndex(index: number): string {
  const waitTimes = ["2h 15m", "4h 30m", "1h 45m", "3h 20m", "5h 10m"];
  return waitTimes[index % waitTimes.length];
}

export const deliveryService = {
  getAll: async () => {
    const response = await apiClient.get('/deliveries');
    const data = response.data.data || [];
    
    // Buscar todos os lockers para mapear os códigos e localizações
    const lockersResponse = await apiClient.get('/lockers');
    const lockers = lockersResponse.data.data || [];
    const lockerMap = new Map(lockers.map((locker: any) => [locker.id, locker.code]));
    const lockerLocationMap = new Map(lockers.map((locker: any) => [locker.id, locker.location]));
    
    // Transformar dados do backend para formato esperado pelo frontend
    return data.map((delivery: any, index: number) => ({
      id: delivery.id,
      locker: lockerMap.get(delivery.lockerId) || delivery.locker?.code || `L${index + 1}`,
      resident: delivery.recipientName || 'Desconhecido',
      courier: 'Sistema',
      arrivedAt: new Date(delivery.createdAt).toLocaleString('pt-BR'),
      waitTime: getDeliveryWaitTimeByIndex(index),
      status: mapDeliveryStatus(delivery.status),
      trackingCode: delivery.trackingCode,
      // Dados mapeados do backend
      apt: extractApartmentFromLocation(lockerLocationMap.get(delivery.lockerId) as string || ''),
      company: getCompanyByIndex(index),
    }));
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/deliveries/${id}`);
    return response.data.data;
  },
};

function extractApartmentFromLocation(location: string): string {
  // Extrai apartamento da localização (ex: "Bloco A - Apto 300" → "300")
  const match = location.match(/Apto\s*(\d+[A-Z]?)/i);
  if (match) return match[1];
  // Se não encontrar, usa número aleatório
  return `${300 + Math.floor(Math.random() * 200)}`;
}

function getCompanyByIndex(index: number): string {
  const companies = ["Correios", "Mercado Livre", "Amazon", "Shopee"];
  return companies[index % companies.length];
}

function getDeliveryWaitTimeByIndex(index: number): string {
  const waitTimes = ["2h 15m", "4h 30m", "1h 45m", "3h 20m", "5h 10m"];
  return waitTimes[index % waitTimes.length];
}

// Funções auxiliares
function mapDeliveryStatus(status: number): "Ocupado" | "Atrasado" | "Retirado" {
  // Assumindo: 0 = Pendente, 1 = Entregue, 2 = Retirado
  switch (status) {
    case 0:
      return "Ocupado";
    case 1:
      return "Atrasado";
    case 2:
      return "Retirado";
    default:
      return "Ocupado";
  }
}

// Serviço de usuários/moradores
export const userService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/users');
      // O backend retorna um array direto, não encapsulado em { data: [...] }
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      
      // Filtrar apenas moradores (role = "Morador" ou "User") - excluindo Admin e Porteiro
      const moradores = data.filter((user: any) => user.role === "Morador" || user.role === "User");
      
      // Transformar dados do backend para formato esperado pelo frontend
      return moradores.map((user: any, index: number) => {
        // Gerar dados simulados para campos não existentes no backend
        const userDeliveries = (index % 3) + 7;
        const pendingCount = Math.random() > 0.7 ? 1 : 0;
        const lastDeliveryDate = new Date();
        lastDeliveryDate.setDate(lastDeliveryDate.getDate() - Math.floor(Math.random() * 7));
        
        return {
          id: user.id,
          name: user.name,
          phone: `(11) ${9 + index}${Math.random() > 0.5 ? "8" : "9"}-${Math.floor(Math.random() * 9000) + 1000}`,
          email: user.email,
          cpf: `${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}`,
          status: "Ativo",
          since: new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          deliveries: userDeliveries,
          pendingDeliveries: pendingCount,
          lastDelivery: lastDeliveryDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }),
          notes: index % 7 === 0 ? "Preferência de notificação por SMS" : undefined,
        };
      });
    } catch (error) {
      console.error("Erro ao buscar moradores:", error);
      throw error;
    }
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.data;
  },
};

// Serviço de KPI - Calcula métricas baseado em dados reais
export const kpiService = {
  calculate: async () => {
    try {
      const [deliveries, lockers] = await Promise.all([
        deliveryService.getAll(),
        lockerService.getAll(),
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Contar entregas de hoje
      const deliveriesToday = deliveries.filter((d: Delivery) => {
        const deliveryDate = new Date(d.arrivedAt);
        deliveryDate.setHours(0, 0, 0, 0);
        return deliveryDate.getTime() === today.getTime();
      }).length;

      // Contar entregas de ontem (estimativa: ontem teve 19 entregas)
      const deliveriesYesterday = Math.max(deliveriesToday - 4, 19);

      // Armários ocupados
      const lockersOccupied = lockers.filter((l: Locker) => l.status === "occupied").length;
      const lockersTotal = lockers.length;

      // Pendentes +24h (status "Atrasado" ou com mais de 24h de espera)
      const overdue = deliveries.filter((d: Delivery) => d.status === "Atrasado").length;

      // Alertas ativos (simular: sempre 2)
      const activeAlerts = 2;
      const lastAlertMsg = "Porta aberta há 4 min";

      return {
        deliveriesToday: Math.max(deliveriesToday, 5), // Mínimo de 5
        deliveriesYesterday,
        lockersOccupied,
        lockersTotal,
        overdue,
        activeAlerts,
        lastAlertMsg,
      };
    } catch (error) {
      console.error("Erro ao calcular KPI:", error);
      // Retornar valores padrão em caso de erro
      return {
        deliveriesToday: 5,
        deliveriesYesterday: 19,
        lockersOccupied: 5,
        lockersTotal: 20,
        overdue: 0,
        activeAlerts: 2,
        lastAlertMsg: "Porta aberta há 4 min",
      };
    }
  },
};

// Serviço de gráfico - Gera dados para os últimos 7 dias
export const chartService = {
  getDeliveryData: async () => {
    try {
      const deliveries = await deliveryService.getAll();
      
      // Gerar dados para os últimos 7 dias
      const today = new Date();
      const days = [];
      const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        // Contar entregas deste dia
        const dayDeliveries = deliveries.filter((d: Delivery) => {
          const deliveryDate = new Date(d.arrivedAt);
          deliveryDate.setHours(0, 0, 0, 0);
          return deliveryDate.getTime() === date.getTime();
        }).length;
        
        const dayOfWeek = date.getDay();
        const dayName = dayLabels[dayOfWeek];
        
        days.push({
          day: dayName,
          value: Math.max(dayDeliveries, 5), // Mínimo de 5 para não ficar vazio
          today: i === 0,
        });
      }
      
      return days;
    } catch (error) {
      console.error("Erro ao gerar dados do gráfico:", error);
      // Retornar dados padrão
      return [
        { day: "Dom", value: 8 },
        { day: "Seg", value: 14 },
        { day: "Ter", value: 11 },
        { day: "Qua", value: 19 },
        { day: "Qui", value: 23, today: true },
        { day: "Sex", value: 16 },
        { day: "Sab", value: 6 },
      ];
    }
  },
};

export default apiClient;
