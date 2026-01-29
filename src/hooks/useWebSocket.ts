// src/hooks/useWebSocket.ts

import { useEffect, useRef, useState, useCallback } from 'react';
import { websocketService } from '../services/websocketService';
import type { TransactionWebSocketData, GlobeTransaction, Transaction } from '../types/transaction';

interface UseWebSocketReturn {
  transactions: Transaction[];
  globeTransactions: GlobeTransaction[];
  isConnected: boolean;
  error: string | null;
  latestTransaction: Transaction | null;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [globeTransactions, setGlobeTransactions] = useState<GlobeTransaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestTransaction, setLatestTransaction] = useState<Transaction | null>(null);
  
  const hasConnected = useRef(false);

  const convertToTransaction = useCallback((data: TransactionWebSocketData): Transaction => {
    // Mascara o número do cartão (mostra apenas os últimos 4 dígitos)
    const maskedCardNumber = `**** **** **** ${data.card.cardNumber.slice(-4)}`;

    // Mapeia a decisão para o status
    const getStatus = (): 'APPROVED' | 'PENDING' | 'DECLINED' => {
      if (data.transactionDecision === 'APPROVED') return 'APPROVED';
      if (data.transactionDecision === 'REVIEW') return 'PENDING';
      return 'DECLINED';
    };

    return {
      transactionId: data.card.cardId,
      card: {
        cardNumber: maskedCardNumber,
        cardholderName: data.card.cardHolderName,
      },
      merchantCategory: data.merchantCategory,
      amount: data.amount,
      transactionDateAndTime: data.transactionDateAndTime,
      latitude: data.latitude,
      longitude: data.longitude,
      device: {
        deviceType: data.device.deviceType,
        deviceName: `${data.device.os} - ${data.device.browser}`,
      },
      ipAddress: data.ipAddress,
      transactionStatus: getStatus(),
      isFraud: data.isFraud,
    };
  }, []);

  const convertToGlobeTransaction = useCallback((data: TransactionWebSocketData): GlobeTransaction => {
    return {
      lat: parseFloat(data.latitude),
      lng: parseFloat(data.longitude),
      cardBrand: data.card.cardBrand,
      ipAddress: data.ipAddress,
      country: data.localizationDto.countryCode,
      city: data.localizationDto.city,
      amount: data.amount,
      merchantCategory: data.merchantCategory,
      severity: data.severity,
      isFraud: data.isFraud,
      decision: data.transactionDecision,
      timestamp: data.createdAt,
    };
  }, []);

  const handleMessage = useCallback((data: TransactionWebSocketData) => {
    const transaction = convertToTransaction(data);
    const globeTransaction = convertToGlobeTransaction(data);

    setLatestTransaction(transaction);

    // Adiciona no início da lista (mais recente primeiro)
    setTransactions((prev) => [transaction, ...prev]);
    
    // Adiciona no globo
    setGlobeTransactions((prev) => [...prev, globeTransaction]);

    // Limita o número de transações (últimas 100)
    setTransactions((prev) => prev.slice(0, 100));
    setGlobeTransactions((prev) => prev.slice(0, 100));
  }, [convertToTransaction, convertToGlobeTransaction]);

  useEffect(() => {
    if (hasConnected.current) return;

    hasConnected.current = true;

    websocketService
      .connect(handleMessage)
      .then(() => {
        setIsConnected(true);
        setError(null);
      })
      .catch((err) => {
        setIsConnected(false);
        setError(err.message || 'Erro ao conectar ao WebSocket');
        hasConnected.current = false;
      });

    return () => {
      websocketService.disconnect();
      hasConnected.current = false;
    };
  }, [handleMessage]);

  return {
    transactions,
    globeTransactions,
    isConnected,
    error,
    latestTransaction,
  };
};