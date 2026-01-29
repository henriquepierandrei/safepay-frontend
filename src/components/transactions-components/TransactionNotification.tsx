// src/components/TransactionNotification.tsx

import React, { useEffect, useState } from 'react'
import type { Transaction } from '../pages/globe/Globe'

interface NotificationItem {
  id: string
  transaction: Transaction
  timestamp: Date
}

interface TransactionNotificationProps {
  notifications: NotificationItem[]
  onRemove: (id: string) => void
  maxVisible?: number
}

const TransactionNotification: React.FC<TransactionNotificationProps> = ({
  notifications,
  onRemove,
  maxVisible = 5
}) => {
  const visibleNotifications = notifications.slice(0, maxVisible)

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm">
      {visibleNotifications.map((notification, index) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={() => onRemove(notification.id)}
          index={index}
        />
      ))}
      
      {notifications.length > maxVisible && (
        <div className="text-xs text-gray-400 text-center py-1">
          +{notifications.length - maxVisible} mais transações...
        </div>
      )}
    </div>
  )
}

interface NotificationToastProps {
  notification: NotificationItem
  onRemove: () => void
  index: number
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onRemove,
  index
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const { transaction } = notification

  useEffect(() => {
    // Animar entrada
    const showTimer = setTimeout(() => setIsVisible(true), 50)
    
    // Auto-remover após 5 segundos
    const removeTimer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onRemove, 300)
    }, 5000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(removeTimer)
    }
  }, [onRemove])

  const getStatusColor = () => {
    if (transaction.isFraud) return 'border-red-500/50 bg-red-500/10'
    if (transaction.severity === 'HIGH') return 'border-orange-500/50 bg-orange-500/10'
    if (transaction.severity === 'MEDIUM') return 'border-yellow-500/50 bg-yellow-500/10'
    return 'border-emerald-500/50 bg-emerald-500/10'
  }

  const getStatusBadge = () => {
    if (transaction.isFraud) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-400 rounded-full uppercase">
          Fraude
        </span>
      )
    }
    if (transaction.decision === 'APPROVED') {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full uppercase">
          Aprovada
        </span>
      )
    }
    if (transaction.decision === 'REVIEW') {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded-full uppercase">
          Revisão
        </span>
      )
    }
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-500/20 text-gray-400 rounded-full uppercase">
        Pendente
      </span>
    )
  }

  const getIcon = () => {
    if (transaction.isFraud) {
      return (
        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      )
    }
    return (
      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
    )
  }

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
      `}
      style={{
        transitionDelay: `${index * 50}ms`
      }}
    >
      <div
        className={`
          relative rounded-lg border backdrop-blur-md p-3 shadow-xl
          ${getStatusColor()}
        `}
      >


        <div className="flex items-start gap-3">
          {getIcon()}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold text-white truncate">
                Nova Transação
              </span>
              {getStatusBadge()}
            </div>
            
            <div className="space-y-1">
              {transaction.amount !== undefined && (
                <div className="text-sm font-bold text-white">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(transaction.amount)}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                {transaction.city && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {transaction.city}, {transaction.country}
                  </span>
                )}
                {transaction.cardBrand && (
                  <span className="px-1.5 py-0.5 bg-white/10 rounded text-white uppercase">
                    {transaction.cardBrand}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onRemove}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionNotification