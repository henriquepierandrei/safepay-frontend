// src/types/transaction.ts

// Dados que vêm do WebSocket (backend)
export interface TransactionWebSocketData {
  card: {
    cardId: string;
    cardNumber: string;
    cardHolderName: string;
    cardBrand: string;
    expirationDate: string;
    creditLimit: number;
    status: string;
  };
  merchantCategory: string;
  amount: number;
  isReimbursement: boolean;
  transactionDateAndTime: string;
  latitude: string;
  longitude: string;
  localizationDto: {
    countryCode: string;
    state: string | null;
    city: string;
  };
  validations: {
    score: number;
    triggeredAlerts: string[];
  };
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  device: {
    id: string;
    fingerPrintId: string;
    deviceType: 'MOBILE' | 'DESKTOP' | 'TABLET';
    os: string;
    browser: string;
  };
  ipAddress: string;
  transactionDecision: 'APPROVED' | 'REVIEW' | 'DECLINED';
  isFraud: boolean;
  createdAt: string;
}

// Formato usado no componente Transactions (lista)
export interface Transaction {
  transactionId: string;
  card: {
    cardNumber: string;
    cardholderName: string;
  };
  merchantCategory: string;
  amount: number;
  transactionDateAndTime: string;
  latitude: string;
  longitude: string;
  device: {
    deviceType: 'MOBILE' | 'DESKTOP' | 'TABLET';
    deviceName: string;
  };
  ipAddress: string;
  transactionStatus: 'APPROVED' | 'PENDING' | 'DECLINED';
  isFraud: boolean;
}

// Formato usado no Globe (globo 3D)
export interface GlobeTransaction {
  lat: number;
  lng: number;
  cardBrand: string;
  ipAddress: string;
  country: string;
  city: string;
  amount: number;
  merchantCategory: string;
  severity: string;
  isFraud: boolean;
  decision: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}