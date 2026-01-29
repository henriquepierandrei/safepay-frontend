// src/services/websocketService.ts

import { Client } from '@stomp/stompjs';
import type { StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { TransactionWebSocketData } from '../types/transaction';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

export class WebSocketService {
  private client: Client | null = null;
  private subscription: StompSubscription | null = null;

  connect(onMessage: (data: TransactionWebSocketData) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
          console.log('✅ WebSocket conectado!');
          
          // Subscreve ao tópico de transações
          this.subscription = this.client!.subscribe(
            '/topic/transactions',
            (message) => {
              try {
                const data: TransactionWebSocketData = JSON.parse(message.body);
                console.log('📦 Transação recebida:', data);
                onMessage(data);
              } catch (error) {
                console.error('❌ Erro ao processar mensagem:', error);
              }
            }
          );

          resolve();
        },

        onStompError: (frame) => {
          console.error('❌ Erro STOMP:', frame.headers['message']);
          console.error('Detalhes:', frame.body);
          reject(new Error(frame.headers['message']));
        },

        onWebSocketError: (error) => {
          console.error('❌ Erro WebSocket:', error);
          reject(error);
        },

        onDisconnect: () => {
          console.log('🔌 WebSocket desconectado');
        },
      });

      this.client.activate();
    });
  }

  disconnect(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    console.log('🔌 WebSocket desconectado manualmente');
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }
}

export const websocketService = new WebSocketService();