// src/services/transactionService.ts

import { api } from './api';
import type { Transaction, FraudAnalysisResponse } from '../types/transaction';

export const transactionService = {
  // Analisar uma transação
  analyzeTransaction: async (transaction: Transaction): Promise<FraudAnalysisResponse> => {
    const response = await api.post<FraudAnalysisResponse>('/transactions/analyze', transaction);
    return response.data;
  },

  // Buscar histórico de transações de um usuário
  getUserTransactions: async (userId: string): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>(`/transactions/user/${userId}`);
    return response.data;
  },

  // Buscar detalhes de uma transação específica
  getTransactionById: async (transactionId: string): Promise<FraudAnalysisResponse> => {
    const response = await api.get<FraudAnalysisResponse>(`/transactions/${transactionId}`);
    return response.data;
  },

  // Buscar estatísticas gerais
  getStatistics: async () => {
    const response = await api.get('/transactions/statistics');
    return response.data;
  },
};