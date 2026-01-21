import React, { useState } from 'react';
import { AlertTriangle, CreditCard, MapPin, Smartphone, TrendingUp, Clock, DollarSign, Shield, X, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import Navbar from '../../components/navbar-components/NavBar';

interface FraudReason {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FraudAlert {
  id: string;
  cardNumber: string;
  cardHolder: string;
  cardBrand: string;
  amount: number;
  location: string;
  device: string;
  timestamp: string;
  riskLevel: 'high' | 'medium' | 'low';
  reasons: FraudReason[];
}

const AlertsPage = () => {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Converter data do formato ISO (yyyy-mm-dd) para dd/mm/yyyy para comparação
  const formatDateForComparison = (isoDate: string) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  // Função para retornar o ícone SVG da bandeira do cartão
  const getCardBrandIcon = (brand: string) => {
    switch (brand) {
      case 'MASTERCARD':
        return (
          <svg viewBox="0 0 48 32" className="w-8 h-6">
            <circle cx="15" cy="16" r="12" fill="#EB001B"/>
            <circle cx="33" cy="16" r="12" fill="#F79E1B"/>
            <path d="M24 8c-2.5 2-4 5-4 8s1.5 6 4 8c2.5-2 4-5 4-8s-1.5-6-4-8z" fill="#FF5F00"/>
          </svg>
        );
      case 'VISA':
        return (
          <svg viewBox="0 0 48 32" className="w-8 h-6">
            <rect width="48" height="32" rx="4" fill="#1434CB"/>
            <text x="24" y="20" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">VISA</text>
          </svg>
        );
      case 'AMERICAN_EXPRESS':
        return (
          <svg viewBox="0 0 48 32" className="w-8 h-6">
            <rect width="48" height="32" rx="4" fill="#006FCF"/>
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">AMEX</text>
          </svg>
        );
      case 'ELO':
        return (
          <svg viewBox="0 0 48 32" className="w-8 h-6">
            <rect width="48" height="32" rx="4" fill="#000000"/>
            <circle cx="12" cy="16" r="6" fill="#FFCB05"/>
            <circle cx="24" cy="16" r="6" fill="#00A4E0"/>
            <circle cx="36" cy="16" r="6" fill="#EF4123"/>
          </svg>
        );
      default:
        return <CreditCard className="w-6 h-6 text-emerald-400/60" />;
    }
  };

  // Dados de exemplo
  const alerts: FraudAlert[] = [
    {
      id: '1',
      cardNumber: '**** **** **** 4829',
      cardHolder: 'Maria Silva Santos',
      cardBrand: 'VISA',
      amount: 8750.00,
      location: 'Miami, FL, EUA',
      device: 'iPhone 14 Pro - iOS 17.2',
      timestamp: '18/01/2026 14:32',
      riskLevel: 'high',
      reasons: [
        {
          icon: <DollarSign className="w-5 h-5" />,
          title: 'Valor Acima da Média',
          description: 'Transação de R$ 8.750,00 - 340% acima da média mensal de R$ 2.100,00'
        },
        {
          icon: <MapPin className="w-5 h-5" />,
          title: 'Localização Incomum',
          description: 'Primeira transação registrada nos EUA. Última compra: São Paulo, BR'
        },
        {
          icon: <Clock className="w-5 h-5" />,
          title: 'Horário Suspeito',
          description: 'Transação fora do padrão horário habitual (09h-18h)'
        }
      ]
    },
    {
      id: '2',
      cardNumber: '**** **** **** 7216',
      cardHolder: 'João Pedro Oliveira',
      cardBrand: 'MASTERCARD',
      amount: 450.00,
      location: 'Guarapari, ES, BR',
      device: 'Galaxy S23 - Android 14',
      timestamp: '18/01/2026 09:15',
      riskLevel: 'medium',
      reasons: [
        {
          icon: <Smartphone className="w-5 h-5" />,
          title: 'Dispositivo Não Reconhecido',
          description: 'Primeira transação realizada com este dispositivo'
        },
        {
          icon: <TrendingUp className="w-5 h-5" />,
          title: 'Padrão de Compra Alterado',
          description: 'Categoria de produto diferente do histórico de compras'
        }
      ]
    },
    {
      id: '3',
      cardNumber: '**** **** **** 9103',
      cardHolder: 'Ana Costa Ferreira',
      cardBrand: 'AMERICAN_EXPRESS',
      amount: 12500.00,
      location: 'Londres, Reino Unido',
      device: 'MacBook Pro - macOS 14',
      timestamp: '18/01/2026 03:47',
      riskLevel: 'high',
      reasons: [
        {
          icon: <DollarSign className="w-5 h-5" />,
          title: 'Valor Extremamente Alto',
          description: 'Transação de R$ 12.500,00 - 520% acima da média mensal'
        },
        {
          icon: <MapPin className="w-5 h-5" />,
          title: 'País de Alto Risco',
          description: 'Transação internacional em região com alto índice de fraude'
        },
        {
          icon: <Clock className="w-5 h-5" />,
          title: 'Horário de Madrugada',
          description: 'Transação às 03:47 - fora do padrão habitual do titular'
        },
        {
          icon: <TrendingUp className="w-5 h-5" />,
          title: 'Múltiplas Tentativas',
          description: '3 tentativas de transação nos últimos 10 minutos'
        }
      ]
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'from-red-700/80 to-red-800/80';
      case 'medium':
        return 'from-yellow-700/80 to-yellow-800/80';
      case 'low':
        return 'from-emerald-700/80 to-emerald-800/80';
      default:
        return 'from-emerald-700/80 to-emerald-800/80';
    }
  };

  const getRiskBorderColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'border-red-800/30';
      case 'medium':
        return 'border-yellow-800/30';
      case 'low':
        return 'border-emerald-800/30';
      default:
        return 'border-emerald-800/30';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'high':
        return 'Risco Alto';
      case 'medium':
        return 'Risco Médio';
      case 'low':
        return 'Risco Baixo';
      default:
        return 'Risco Desconhecido';
    }
  };

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    const matchesRisk = riskFilter === 'all' || alert.riskLevel === riskFilter;
    const formattedFilterDate = formatDateForComparison(dateFilter);
    const matchesDate = !dateFilter || alert.timestamp.startsWith(formattedFilterDate);
    return matchesRisk && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-emerald-950 to-black py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Navbar />
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full blur-3xl bg-emerald-500/5 -top-48 -left-48 animate-float" />
        <div className="absolute w-80 h-80 rounded-full blur-3xl bg-emerald-600/5 top-1/3 -right-40 animate-float-delayed" />
        <div className="absolute w-72 h-72 rounded-full blur-3xl bg-emerald-500/5 bottom-0 left-1/2 animate-float-slow" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 m-15">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400/90 via-emerald-300/80 to-emerald-500/90 bg-clip-text text-transparent">
              Alertas de Fraude
            </span>
          </h1>
          <p className="text-lg text-emerald-200/50 max-w-2xl mx-auto">
            Monitoramento em tempo real de transações suspeitas
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Filtro por Risco */}
          <div className="bg-black/40 backdrop-blur-xl border border-emerald-500/10 rounded-xl p-5 shadow-lg">
            <label className="block text-sm font-medium text-emerald-400/80 mb-3">
              Filtrar por Nível de Risco
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRiskFilter('all')}
                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  riskFilter === 'all'
                    ? 'bg-emerald-700/80 text-white shadow-lg'
                    : 'border border-emerald-500/30 text-emerald-400/60 hover:scale-105 hover:bg-emerald-900/20'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setRiskFilter('high')}
                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  riskFilter === 'high'
                    ? 'border border-none bg-red-700/80 text-white shadow-lg'
                    : 'border border-red-500/30 text-red-400/60 hover:scale-105 hover:bg-emerald-900/20'
                }`}
              >
                Alto Risco
              </button>
              <button
                onClick={() => setRiskFilter('medium')}
                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  riskFilter === 'medium'
                    ? 'border border-none bg-yellow-700/80 text-white shadow-lg'
                    : 'border border-yellow-500/30 text-yellow-400/60 hover:scale-105 hover:bg-emerald-900/20'
                }`}
              >
                Médio Risco
              </button>
              <button
                onClick={() => setRiskFilter('low')}
                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  riskFilter === 'low'
                    ? 'border border-none bg-emerald-700/80 text-white shadow-lg'
                    : 'border border-emerald-500/30 text-emerald-400/60 hover:bg-gray-800 hover:text-emerald-400'
                }`}
              >
                Baixo Risco
              </button>
            </div>
          </div>

          {/* Filtro por Data */}
          <div className="bg-black/40 backdrop-blur-xl border border-emerald-500/10 rounded-xl p-5 shadow-lg">
            <label htmlFor="date-filter" className="block text-sm font-medium text-emerald-400/80 mb-3">
              Filtrar por Data
            </label>
            <div className="relative">
              <input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-emerald-500/10 text-emerald-50/80 focus:outline-none focus:border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 [color-scheme:dark] cursor-pointer"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400/60 pointer-events-none" />
            </div>
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="mt-2 text-xs text-emerald-400/60 hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Limpar filtro
              </button>
            )}
          </div>
        </div>

        {/* Contador de Resultados */}
        {(riskFilter !== 'all' || dateFilter) && (
          <div className="mb-6 text-center animate-fade-in">
            <p className="text-sm text-emerald-400/60">
              Mostrando <span className="font-semibold text-emerald-400">{filteredAlerts.length}</span> de {alerts.length} alertas
            </p>
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-6">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-16 bg-black/40 backdrop-blur-xl border border-emerald-500/10 rounded-2xl">
              <Shield className="w-16 h-16 mx-auto mb-4 text-emerald-400/40" />
              <h3 className="text-xl font-semibold text-emerald-50/60 mb-2">
                Nenhum alerta encontrado
              </h3>
              <p className="text-emerald-400/40">
                Tente ajustar os filtros para ver mais resultados
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert, index) => (
            <div
              key={alert.id}
              className="bg-emerald-950/30 backdrop-blur-xl border border-emerald-800/20 rounded-2xl shadow-lg shadow-emerald-950/20 overflow-hidden animate-slide-up hover:border-emerald-700/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Alert Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${getRiskColor(alert.riskLevel)} shadow-lg`}>
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-50/90 mb-1">
                        {alert.cardHolder}
                      </h3>
                      <div className="flex items-center gap-2 text-emerald-300/60">
                        <div className=" rounded px-2 py-1 flex items-center">
                          {getCardBrandIcon(alert.cardBrand)}
                        </div>
                        <span className="text-sm">{alert.cardNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getRiskColor(alert.riskLevel)} border ${getRiskBorderColor(alert.riskLevel)}`}>
                    <span className="text-sm font-semibold text-white">
                      {getRiskLabel(alert.riskLevel)}
                    </span>
                  </div>
                </div>

                {/* Transaction Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-black/25 border border-emerald-500/10">
                    <DollarSign className="w-5 h-5 text-emerald-400/60" />
                    <div>
                      <p className="text-xs text-emerald-300/50">Valor</p>
                      <p className="text-sm font-semibold text-emerald-50/80">
                        R$ {alert.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-black/25 border border-emerald-500/10">
                    <MapPin className="w-5 h-5 text-emerald-400/60" />
                    <div>
                      <p className="text-xs text-emerald-300/50">Localização</p>
                      <p className="text-sm font-semibold text-emerald-50/80">{alert.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-black/25 border border-emerald-500/10">
                    <Smartphone className="w-5 h-5 text-emerald-400/60" />
                    <div>
                      <p className="text-xs text-emerald-300/50">Dispositivo</p>
                      <p className="text-sm font-semibold text-emerald-50/80">{alert.device}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-black/25 border border-emerald-500/10">
                    <Clock className="w-5 h-5 text-emerald-400/60" />
                    <div>
                      <p className="text-xs text-emerald-300/50">Data/Hora</p>
                      <p className="text-sm font-semibold text-emerald-50/80">{alert.timestamp}</p>
                    </div>
                  </div>
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-black/25 border border-emerald-500/10 hover:bg-black/50 hover:border-emerald-500/20 transition-all duration-300 group"
                >
                  <span className="text-sm font-medium text-emerald-400/80">
                    Ver Motivos da Suspeita ({alert.reasons.length})
                  </span>
                  {expandedAlert === alert.id ? (
                    <ChevronUp className="w-5 h-5 text-emerald-400/60 group-hover:text-emerald-400/80 transition-colors" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-emerald-400/60 group-hover:text-emerald-400/80 transition-colors" />
                  )}
                </button>
              </div>

              {/* Expanded Reasons */}
              {expandedAlert === alert.id && (
                <div className="px-6 pb-6 space-y-3 animate-slide-up">
                  {alert.reasons.map((reason, reasonIndex) => (
                    <div
                      key={reasonIndex}
                      className="p-4 rounded-xl bg-black/30 border border-emerald-500/10"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400/70">
                          {reason.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-emerald-50/90 mb-1">
                            {reason.title}
                          </h4>
                          <p className="text-sm text-emerald-300/60">
                            {reason.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(3deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        /* Estilização do calendário nativo */
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
        }
      `}</style>
    </div>
  );
};

export default AlertsPage;