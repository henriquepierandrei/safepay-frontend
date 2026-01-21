import React, { useState } from 'react';
import { 
  CreditCard, 
  Filter, 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  ChevronDown,
  TrendingUp
} from 'lucide-react';
import Navbar from '../../components/navbar-components/NavBar';

interface Transaction {
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


const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockTransactions: Transaction[] = [
    {
      transactionId: '550e8400-e29b-41d4-a716-446655440001',
      card: { cardNumber: '**** **** **** 1234', cardholderName: 'João Silva' },
      merchantCategory: 'GROCERY',
      amount: 245.80,
      transactionDateAndTime: '2026-01-21T14:30:00',
      latitude: '-19.9167',
      longitude: '-43.9345',
      device: { deviceType: 'MOBILE', deviceName: 'iPhone 14 Pro' },
      ipAddress: '192.168.1.100',
      transactionStatus: 'APPROVED',
      isFraud: false
    },
    {
      transactionId: '550e8400-e29b-41d4-a716-446655440002',
      card: { cardNumber: '**** **** **** 1234', cardholderName: 'João Silva' },
      merchantCategory: 'ELECTRONICS',
      amount: 1299.99,
      transactionDateAndTime: '2026-01-21T12:15:00',
      latitude: '-19.9167',
      longitude: '-43.9345',
      device: { deviceType: 'DESKTOP', deviceName: 'Windows PC' },
      ipAddress: '192.168.1.101',
      transactionStatus: 'PENDING',
      isFraud: false
    },
    {
      transactionId: '550e8400-e29b-41d4-a716-446655440003',
      card: { cardNumber: '**** **** **** 1234', cardholderName: 'João Silva' },
      merchantCategory: 'ENTERTAINMENT',
      amount: 89.90,
      transactionDateAndTime: '2026-01-20T19:45:00',
      latitude: '-19.9167',
      longitude: '-43.9345',
      device: { deviceType: 'TABLET', deviceName: 'iPad Air' },
      ipAddress: '192.168.1.102',
      transactionStatus: 'APPROVED',
      isFraud: false
    },
    {
      transactionId: '550e8400-e29b-41d4-a716-446655440004',
      card: { cardNumber: '**** **** **** 1234', cardholderName: 'João Silva' },
      merchantCategory: 'TRAVEL',
      amount: 2500.00,
      transactionDateAndTime: '2026-01-20T08:20:00',
      latitude: '-22.9068',
      longitude: '-43.1729',
      device: { deviceType: 'MOBILE', deviceName: 'Samsung Galaxy S23' },
      ipAddress: '203.0.113.45',
      transactionStatus: 'DECLINED',
      isFraud: true
    }
  ];

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'MOBILE': return <Smartphone className="w-4 h-4" />;
      case 'DESKTOP': return <Monitor className="w-4 h-4" />;
      case 'TABLET': return <Tablet className="w-4 h-4" />;
      default: return <Smartphone className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string, isFraud: boolean) => {
    if (isFraud) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 backdrop-blur-xl border border-red-500/20 text-red-400 text-xs font-medium">
          <AlertTriangle className="w-3 h-3" />
          Fraude
        </span>
      );
    }

    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Aprovada
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 text-amber-400 text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pendente
          </span>
        );
      case 'DECLINED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 backdrop-blur-xl border border-red-500/20 text-red-400 text-xs font-medium">
            <AlertTriangle className="w-3 h-3" />
            Recusada
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.card.cardNumber.includes(searchTerm) ||
      transaction.merchantCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.card.cardholderName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'fraud' && transaction.isFraud) ||
      (filterStatus === 'approved' && transaction.transactionStatus === 'APPROVED' && !transaction.isFraud) ||
      (filterStatus === 'pending' && transaction.transactionStatus === 'PENDING') ||
      (filterStatus === 'declined' && transaction.transactionStatus === 'DECLINED');

    return matchesSearch && matchesFilter;
  });

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const fraudCount = filteredTransactions.filter(t => t.isFraud).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#09140e] to-black">
        
      <Navbar />
      
      {/* Background Effects - iOS Glass Style */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full blur-3xl bg-emerald-500/10 top-10 left-1/4 animate-pulse-slow" />
        <div className="absolute w-80 h-80 rounded-full blur-3xl bg-emerald-400/5 bottom-20 right-1/4 animate-pulse-slower" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-white/5 backdrop-blur-2xl border border-white/10">
              <CreditCard className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Transações
            </h1>
          </div>
          <p className="text-gray-400">
            Visualize e gerencie todas as transações do cartão
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Transações</span>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">{filteredTransactions.length}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Valor Total</span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalAmount)}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Alertas de Fraude</span>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-white">{fraudCount}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por cartão, categoria ou titular..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-2xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 rounded-xl bg-white/5 backdrop-blur-2xl border border-white/10 text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filtros
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-2xl border border-white/10 animate-slide-down">
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'Todas' },
                  { value: 'approved', label: 'Aprovadas' },
                  { value: 'pending', label: 'Pendentes' },
                  { value: 'declined', label: 'Recusadas' },
                  { value: 'fraud', label: 'Fraudes' }
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterStatus(filter.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterStatus === filter.value
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Transactions List */}
        <div className="space-y-4 pb-8">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-white/5 backdrop-blur-2xl border border-white/10">
              <Shield className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Nenhuma transação encontrada</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.transactionId}
                className="p-4 sm:p-6 rounded-xl bg-white/5 backdrop-blur-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex flex-col gap-4">
                  {/* Top Section */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold text-base sm:text-lg truncate">
                          {transaction.merchantCategory}
                        </h3>
                        {getStatusBadge(transaction.transactionStatus, transaction.isFraud)}
                      </div>
                      <p className="text-gray-400 text-sm truncate">
                        {transaction.card.cardholderName} • {transaction.card.cardNumber}
                      </p>
                    </div>
                    
                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl sm:text-2xl font-bold text-white whitespace-nowrap">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Section - Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-400 pt-3 border-t border-white/5">
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Calendar className="w-4 h-4 flex-shrink-0 text-gray-500" />
                        <span>{formatDate(transaction.transactionDateAndTime)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        {getDeviceIcon(transaction.device.deviceType)}
                        <span className="truncate max-w-[150px]">{transaction.device.deviceName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <MapPin className="w-4 h-4 flex-shrink-0 text-gray-500" />
                        <span className="truncate">{transaction.latitude}, {transaction.longitude}</span>
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs whitespace-nowrap">
                      IP: {transaction.ipAddress}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.08); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Transactions;