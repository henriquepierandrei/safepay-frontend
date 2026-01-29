// src/types/fraudAlert.ts

// Tipos de alerta disponíveis
export type AlertType =
  | 'HIGH_AMOUNT'
  | 'LIMIT_EXCEEDED'
  | 'VELOCITY_ABUSE'
  | 'BURST_ACTIVITY'
  | 'LOCATION_ANOMALY'
  | 'IMPOSSIBLE_TRAVEL'
  | 'HIGH_RISK_COUNTRY'
  | 'NEW_DEVICE_DETECTED'
  | 'DEVICE_FINGERPRINT_CHANGE'
  | 'TOR_OR_PROXY_DETECTED'
  | 'MULTIPLE_CARDS_SAME_DEVICE'
  | 'TIME_OF_DAY_ANOMALY'
  | 'CARD_TESTING'
  | 'MICRO_TRANSACTION_PATTERN'
  | 'DECLINE_THEN_APPROVE_PATTERN'
  | 'MULTIPLE_FAILED_ATTEMPTS'
  | 'SUSPICIOUS_SUCCESS_AFTER_FAILURE'
  | 'ANOMALY_MODEL_TRIGGERED'
  | 'CREDIT_LIMIT_REACHED'
  | 'EXPIRATION_DATE_APPROACHING'

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type AlertStatus = 'PENDING' | 'REVIEWED' | 'CONFIRMED' | 'DISMISSED'

// Request DTO
export interface FraudAlertFilterRequestDTO {
  recentAlerts?: boolean
  severity?: Severity
  startFraudScore?: number
  endFraudScore?: number
  alertTypeList?: AlertType[]
  createdAtFrom?: string
  createdAtTo?: string
  transactionId?: string
  cardId?: string
  deviceId?: string
}

// Response DTO
export interface FraudAlertResponseDTO {
  id?: string
  alertTypeList: AlertType[]
  severity: Severity
  fraudProbability: number
  description: string
  status: AlertStatus
  createdAt: string
  fraudScore: number
  // Campos adicionais que podem vir da API
  transactionId?: string
  cardId?: string
  deviceId?: string
  amount?: number
  location?: string
  cardNumber?: string
  cardHolder?: string
  cardBrand?: string
  ipAddress?: string
  device?: string
}

// Response paginado
export interface PagedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

// Informações do tipo de alerta
export interface AlertTypeInfo {
  type: AlertType
  title: string
  description: string
  riskScore: number
  icon: string // nome do ícone
  category: 'amount' | 'velocity' | 'location' | 'device' | 'pattern' | 'model'
}

// Mapeamento completo dos tipos de alerta
export const ALERT_TYPE_INFO: Record<AlertType, AlertTypeInfo> = {
  HIGH_AMOUNT: {
    type: 'HIGH_AMOUNT',
    title: 'Valor Acima da Média',
    description: 'Valor significativamente acima do histórico do cartão',
    riskScore: 20,
    icon: 'dollar-sign',
    category: 'amount'
  },
  LIMIT_EXCEEDED: {
    type: 'LIMIT_EXCEEDED',
    title: 'Limite Excedido',
    description: 'Tentativa de transação acima do limite disponível',
    riskScore: 40,
    icon: 'alert-triangle',
    category: 'amount'
  },
  VELOCITY_ABUSE: {
    type: 'VELOCITY_ABUSE',
    title: 'Abuso de Velocidade',
    description: 'Muitas transações em curto intervalo de tempo',
    riskScore: 42,
    icon: 'zap',
    category: 'velocity'
  },
  BURST_ACTIVITY: {
    type: 'BURST_ACTIVITY',
    title: 'Pico de Atividade',
    description: 'Pico súbito de atividade fora do padrão histórico',
    riskScore: 30,
    icon: 'trending-up',
    category: 'velocity'
  },
  LOCATION_ANOMALY: {
    type: 'LOCATION_ANOMALY',
    title: 'Localização Anômala',
    description: 'Localização fora do padrão histórico do cartão',
    riskScore: 20,
    icon: 'map-pin',
    category: 'location'
  },
  IMPOSSIBLE_TRAVEL: {
    type: 'IMPOSSIBLE_TRAVEL',
    title: 'Viagem Impossível',
    description: 'Distância incompatível com o tempo entre transações',
    riskScore: 45,
    icon: 'plane',
    category: 'location'
  },
  HIGH_RISK_COUNTRY: {
    type: 'HIGH_RISK_COUNTRY',
    title: 'País de Alto Risco',
    description: 'Transação originada em país classificado como alto risco',
    riskScore: 40,
    icon: 'globe',
    category: 'location'
  },
  NEW_DEVICE_DETECTED: {
    type: 'NEW_DEVICE_DETECTED',
    title: 'Novo Dispositivo',
    description: 'Detecção de um dispositivo nunca utilizado anteriormente',
    riskScore: 10,
    icon: 'smartphone',
    category: 'device'
  },
  DEVICE_FINGERPRINT_CHANGE: {
    type: 'DEVICE_FINGERPRINT_CHANGE',
    title: 'Mudança de Fingerprint',
    description: 'Alteração relevante no fingerprint do dispositivo',
    riskScore: 25,
    icon: 'fingerprint',
    category: 'device'
  },
  TOR_OR_PROXY_DETECTED: {
    type: 'TOR_OR_PROXY_DETECTED',
    title: 'VPN/Proxy/TOR Detectado',
    description: 'Uso de VPN, proxy ou rede TOR',
    riskScore: 30,
    icon: 'shield-off',
    category: 'device'
  },
  MULTIPLE_CARDS_SAME_DEVICE: {
    type: 'MULTIPLE_CARDS_SAME_DEVICE',
    title: 'Múltiplos Cartões',
    description: 'Múltiplos cartões utilizados no mesmo dispositivo',
    riskScore: 50,
    icon: 'credit-card',
    category: 'device'
  },
  TIME_OF_DAY_ANOMALY: {
    type: 'TIME_OF_DAY_ANOMALY',
    title: 'Horário Atípico',
    description: 'Transação realizada em horário atípico para o usuário',
    riskScore: 6,
    icon: 'clock',
    category: 'pattern'
  },
  CARD_TESTING: {
    type: 'CARD_TESTING',
    title: 'Teste de Cartão',
    description: 'Pequenas transações repetidas para validação do cartão',
    riskScore: 50,
    icon: 'search',
    category: 'pattern'
  },
  MICRO_TRANSACTION_PATTERN: {
    type: 'MICRO_TRANSACTION_PATTERN',
    title: 'Microtransações',
    description: 'Sequência de microtransações suspeitas',
    riskScore: 35,
    icon: 'minimize-2',
    category: 'pattern'
  },
  DECLINE_THEN_APPROVE_PATTERN: {
    type: 'DECLINE_THEN_APPROVE_PATTERN',
    title: 'Recusa e Aprovação',
    description: 'Múltiplas recusas seguidas de aprovação',
    riskScore: 38,
    icon: 'refresh-cw',
    category: 'pattern'
  },
  MULTIPLE_FAILED_ATTEMPTS: {
    type: 'MULTIPLE_FAILED_ATTEMPTS',
    title: 'Tentativas Falhas',
    description: 'Diversas tentativas falhas consecutivas',
    riskScore: 25,
    icon: 'x-circle',
    category: 'pattern'
  },
  SUSPICIOUS_SUCCESS_AFTER_FAILURE: {
    type: 'SUSPICIOUS_SUCCESS_AFTER_FAILURE',
    title: 'Sucesso Suspeito',
    description: 'Aprovação após sequência de falhas suspeitas',
    riskScore: 35,
    icon: 'alert-circle',
    category: 'pattern'
  },
  ANOMALY_MODEL_TRIGGERED: {
    type: 'ANOMALY_MODEL_TRIGGERED',
    title: 'Modelo de Anomalia',
    description: 'Modelo estatístico detectou comportamento anômalo',
    riskScore: 30,
    icon: 'cpu',
    category: 'model'
  },
  CREDIT_LIMIT_REACHED: {
    type: 'CREDIT_LIMIT_REACHED',
    title: 'Limite Atingido',
    description: 'Limite de crédito atingido ou ultrapassado',
    riskScore: 40,
    icon: 'alert-octagon',
    category: 'amount'
  },
  EXPIRATION_DATE_APPROACHING: {
    type: 'EXPIRATION_DATE_APPROACHING',
    title: 'Expiração Próxima',
    description: 'Transação próxima da data de expiração do cartão',
    riskScore: 25,
    icon: 'calendar',
    category: 'pattern'
  }
}

// Helper para obter cor baseada na severidade
export const getSeverityConfig = (severity: Severity) => {
  const configs = {
    LOW: {
      bg: 'bg-slate-500/20',
      border: 'border-slate-500/30',
      text: 'text-slate-300',
      dot: 'bg-slate-400',
      label: 'Baixo'
    },
    MEDIUM: {
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/30',
      text: 'text-amber-300',
      dot: 'bg-amber-400',
      label: 'Médio'
    },
    HIGH: {
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/30',
      text: 'text-orange-300',
      dot: 'bg-orange-400',
      label: 'Alto'
    },
    CRITICAL: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-300',
      dot: 'bg-red-400',
      label: 'Crítico'
    }
  }
  return configs[severity] || configs.LOW
}

// Helper para obter cor baseada no status
export const getStatusConfig = (status: AlertStatus) => {
  const configs = {
    PENDING: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-300',
      label: 'Pendente'
    },
    REVIEWED: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/30',
      text: 'text-blue-300',
      label: 'Revisado'
    },
    CONFIRMED: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-300',
      label: 'Confirmado'
    },
    DISMISSED: {
      bg: 'bg-slate-500/20',
      border: 'border-slate-500/30',
      text: 'text-slate-400',
      label: 'Descartado'
    }
  }
  return configs[status] || configs.PENDING
}