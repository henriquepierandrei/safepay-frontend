// src/pages/alerts/AlertsPage.tsx

import React, { useState } from 'react'
import {
  AlertTriangle,
  CreditCard,
  MapPin,
  Smartphone,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  Filter,
  RefreshCw,
  Search,
  Zap,
  Globe,
  Plane,
  ShieldOff,
  Cpu,
  AlertOctagon,
  XCircle,
  AlertCircle,
  Minimize2,
  RefreshCcw,
  Fingerprint,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react'
import Navbar from '../../components/navbar-components/NavBar'
import { useFraudAlerts } from '../../hooks/useFraudAlerts'
import {
  ALERT_TYPE_INFO,
  getSeverityConfig,
  getStatusConfig,
  type AlertType,
  type Severity,
  type FraudAlertResponseDTO,
  type FraudAlertFilterRequestDTO
} from '../../types/fraudAlert'

// Mapeamento de ícones
const IconMap: Record<string, React.ReactNode> = {
  'dollar-sign': <DollarSign className="w-4 h-4" />,
  'alert-triangle': <AlertTriangle className="w-4 h-4" />,
  'zap': <Zap className="w-4 h-4" />,
  'trending-up': <TrendingUp className="w-4 h-4" />,
  'map-pin': <MapPin className="w-4 h-4" />,
  'plane': <Plane className="w-4 h-4" />,
  'globe': <Globe className="w-4 h-4" />,
  'smartphone': <Smartphone className="w-4 h-4" />,
  'fingerprint': <Fingerprint className="w-4 h-4" />,
  'shield-off': <ShieldOff className="w-4 h-4" />,
  'credit-card': <CreditCard className="w-4 h-4" />,
  'clock': <Clock className="w-4 h-4" />,
  'search': <Search className="w-4 h-4" />,
  'minimize-2': <Minimize2 className="w-4 h-4" />,
  'refresh-cw': <RefreshCcw className="w-4 h-4" />,
  'x-circle': <XCircle className="w-4 h-4" />,
  'alert-circle': <AlertCircle className="w-4 h-4" />,
  'cpu': <Cpu className="w-4 h-4" />,
  'alert-octagon': <AlertOctagon className="w-4 h-4" />,
  'calendar': <Calendar className="w-4 h-4" />,
}

const getAlertIcon = (iconName: string) => {
  return IconMap[iconName] || <AlertTriangle className="w-4 h-4" />
}

// Componente de Card de Alerta
interface AlertCardProps {
  alert: FraudAlertResponseDTO
  isExpanded: boolean
  onToggle: () => void
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, isExpanded, onToggle }) => {
  const severityConfig = getSeverityConfig(alert.severity)
  const statusConfig = getStatusConfig(alert.status)

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr.replace(' ', 'T'))
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    } catch {
      return dateStr
    }
  }

  const formatCurrency = (value?: number) => {
    if (value === undefined) return 'N/A'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden transition-all duration-300 hover:border-emerald-900/50 hover:shadow-emerald-950/20">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {/* Severity Icon */}
            <div className={`p-3 rounded-xl ${severityConfig.bg} border ${severityConfig.border}`}>
              <AlertTriangle className={`w-5 h-5 ${severityConfig.text}`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-neutral-100">
                  Alerta #{alert.id?.slice(0, 8) || 'N/A'}
                </h3>
                {/* Status Badge */}
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.border} border ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-sm text-neutral-500 line-clamp-1">
                {alert.description}
              </p>
            </div>
          </div>

          {/* Severity Badge */}
          <div className={`px-3 py-1.5 rounded-lg ${severityConfig.bg} border ${severityConfig.border} flex items-center gap-2`}>
            <div className={`w-2 h-2 rounded-full ${severityConfig.dot}`} />
            <span className={`text-sm font-semibold ${severityConfig.text}`}>
              {severityConfig.label}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {/* Fraud Score */}
          <div className="p-3 rounded-xl bg-black/40 border border-neutral-800/60">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-emerald-600/60" />
              <span className="text-xs text-neutral-500">Fraud Score</span>
            </div>
            <p className="text-lg font-bold text-neutral-100">
              {alert.fraudScore}
              <span className="text-xs text-neutral-600 font-normal ml-1">/ 100</span>
            </p>
          </div>

          {/* Probabilidade */}
          <div className="p-3 rounded-xl bg-black/40 border border-neutral-800/60">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600/60" />
              <span className="text-xs text-neutral-500">Probabilidade</span>
            </div>
            <p className="text-lg font-bold text-neutral-100">
              {(alert.fraudProbability * 100).toFixed(1)}%
            </p>
          </div>

          {/* Valor */}
          <div className="p-3 rounded-xl bg-black/40 border border-neutral-800/60">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-emerald-600/60" />
              <span className="text-xs text-neutral-500">Valor</span>
            </div>
            <p className="text-lg font-bold text-neutral-100">
              {formatCurrency(alert.amount)}
            </p>
          </div>

          {/* Data */}
          <div className="p-3 rounded-xl bg-black/40 border border-neutral-800/60">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-emerald-600/60" />
              <span className="text-xs text-neutral-500">Data/Hora</span>
            </div>
            <p className="text-sm font-semibold text-neutral-100">
              {formatDate(alert.createdAt)}
            </p>
          </div>
        </div>

        {/* Alert Types Preview */}
        <div className="flex flex-wrap gap-2 mb-4">
          {alert.alertTypeList.slice(0, 3).map((type) => {
            const info = ALERT_TYPE_INFO[type]
            return (
              <div
                key={type}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-neutral-800/60 text-xs"
              >
                <span className="text-emerald-600/70">{getAlertIcon(info?.icon || 'alert-triangle')}</span>
                <span className="text-neutral-400">{info?.title || type}</span>
              </div>
            )
          })}
          {alert.alertTypeList.length > 3 && (
            <div className="flex items-center px-2.5 py-1 rounded-lg bg-black/50 border border-neutral-800/60 text-xs text-neutral-500">
              +{alert.alertTypeList.length - 3} mais
            </div>
          )}
        </div>

        {/* Expand Button */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-black/30 border border-neutral-800/50 hover:bg-emerald-950/20 hover:border-emerald-900/40 transition-all duration-200 group cursor-pointer"
        >
          <span className="text-sm font-medium text-neutral-500 group-hover:text-emerald-500/80">
            Ver Detalhes ({alert.alertTypeList.length} alertas)
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-neutral-600 group-hover:text-emerald-500/80" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-600 group-hover:text-emerald-500/80" />
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-neutral-800/50 pt-4 animate-fadeIn">
          <h4 className="text-sm font-semibold text-neutral-300 mb-3">
            Motivos do Alerta
          </h4>
          <div className="space-y-2">
            {alert.alertTypeList.map((type, index) => {
              const info = ALERT_TYPE_INFO[type]
              if (!info) return null

              return (
                <div
                  key={`${type}-${index}`}
                  className="p-3 rounded-xl bg-black/40 border border-neutral-800/40 hover:border-emerald-900/30 hover:bg-emerald-950/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-950/40 text-emerald-600/80">
                      {getAlertIcon(info.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="text-sm font-semibold text-neutral-200">
                          {info.title}
                        </h5>
                        <span className="text-xs text-neutral-600">
                          Score: {info.riskScore}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Additional Info */}
          {(alert.transactionId || alert.cardId || alert.deviceId) && (
            <div className="mt-4 pt-4 border-t border-neutral-800/40">
              <h4 className="text-sm font-semibold text-neutral-300 mb-3">
                Informações Adicionais
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {alert.transactionId && (
                  <div className="p-3 rounded-lg bg-black/30 border border-neutral-800/40">
                    <span className="text-xs text-neutral-600 block mb-1">Transaction ID</span>
                    <span className="text-sm text-neutral-300 font-mono truncate block">
                      {alert.transactionId}
                    </span>
                  </div>
                )}
                {alert.cardId && (
                  <div className="p-3 rounded-lg bg-black/30 border border-neutral-800/40">
                    <span className="text-xs text-neutral-600 block mb-1">Card ID</span>
                    <span className="text-sm text-neutral-300 font-mono truncate block">
                      {alert.cardId}
                    </span>
                  </div>
                )}
                {alert.deviceId && (
                  <div className="p-3 rounded-lg bg-black/30 border border-neutral-800/40">
                    <span className="text-xs text-neutral-600 block mb-1">Device ID</span>
                    <span className="text-sm text-neutral-300 font-mono truncate block">
                      {alert.deviceId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Componente de Filtros
interface FiltersProps {
  filters: FraudAlertFilterRequestDTO
  onFilterChange: (filters: FraudAlertFilterRequestDTO) => void
  onClear: () => void
  onRefresh: () => void
  loading: boolean
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onClear,
  onRefresh,
  loading
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSeverityChange = (severity: Severity | undefined) => {
    onFilterChange({ ...filters, severity })
  }

  const handleDateChange = (field: 'createdAtFrom' | 'createdAtTo', value: string) => {
    onFilterChange({
      ...filters,
      [field]: value ? `${value}T00:00:00` : undefined
    })
  }

  const handleAlertTypeToggle = (type: AlertType) => {
    const currentTypes = filters.alertTypeList || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    
    onFilterChange({
      ...filters,
      alertTypeList: newTypes.length > 0 ? newTypes : undefined
    })
  }

  const severities: (Severity | 'ALL')[] = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

  return (
    <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/60 rounded-2xl p-5 mb-6">
      {/* Main Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Severidade
          </label>
          <div className="flex flex-wrap gap-2">
            {severities.map((sev) => {
              const isSelected = sev === 'ALL' ? !filters.severity : filters.severity === sev
              const config = sev === 'ALL' 
                ? { bg: 'bg-neutral-800/60', border: 'border-neutral-700', text: 'text-neutral-300' }
                : getSeverityConfig(sev)
              
              return (
                <button
                  key={sev}
                  onClick={() => handleSeverityChange(sev === 'ALL' ? undefined : sev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? `${config.bg} ${config.border} ${config.text}`
                      : 'bg-black/30 border-neutral-800/60 text-neutral-600 hover:bg-neutral-800/40 hover:text-neutral-400'
                  }`}
                >
                  {sev === 'ALL' ? 'Todos' : getSeverityConfig(sev).label}
                </button>
              )
            })}
          </div>
        </div>

        
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-emerald-500/80 transition-colors mb-4 cursor-pointer"
      >
        <Filter className="w-4 h-4" />
        Filtros Avançados
        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-neutral-800/40 animate-fadeIn">
          <label className="block text-sm font-medium text-neutral-400 mb-3">
            Tipos de Alerta
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.values(ALERT_TYPE_INFO).map((info) => {
              const isSelected = filters.alertTypeList?.includes(info.type)
              return (
                <button
                  key={info.type}
                  onClick={() => handleAlertTypeToggle(info.type)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-400'
                      : 'bg-black/30 border-neutral-800/50 text-neutral-600 hover:bg-neutral-800/40 hover:text-neutral-400'
                  }`}
                >
                  {getAlertIcon(info.icon)}
                  <span>{info.title}</span>
                </button>
              )
            })}
          </div>

          {/* Score Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Score Mínimo
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.startFraudScore || ''}
                onChange={(e) => onFilterChange({
                  ...filters,
                  startFraudScore: e.target.value ? Number(e.target.value) : undefined
                })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-neutral-800/60 text-neutral-200 text-sm focus:outline-none focus:border-emerald-800/60"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Score Máximo
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.endFraudScore || ''}
                onChange={(e) => onFilterChange({
                  ...filters,
                  endFraudScore: e.target.value ? Number(e.target.value) : undefined
                })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-neutral-800/60 text-neutral-200 text-sm focus:outline-none focus:border-emerald-800/60"
                placeholder="100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-800/40">
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/40 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
          Limpar Filtros
        </button>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-sm font-medium text-emerald-400 hover:bg-emerald-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>
    </div>
  )
}

// Componente de Paginação
interface PaginationProps {
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange
}) => {
  const startItem = currentPage * pageSize + 1
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements)

  return (
    <div className="flex items-center justify-between mt-6 px-2">
      <p className="text-sm text-neutral-600">
        Mostrando <span className="font-medium text-neutral-400">{startItem}</span> a{' '}
        <span className="font-medium text-neutral-400">{endItem}</span> de{' '}
        <span className="font-medium text-neutral-400">{totalElements}</span> alertas
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 rounded-lg bg-black/40 border border-neutral-800/60 text-neutral-500 hover:bg-emerald-950/30 hover:border-emerald-900/40 hover:text-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i
            } else if (currentPage < 3) {
              pageNum = i
            } else if (currentPage > totalPages - 4) {
              pageNum = totalPages - 5 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  pageNum === currentPage
                    ? 'bg-emerald-950/60 border border-emerald-800/50 text-emerald-400'
                    : 'bg-black/40 border border-neutral-800/60 text-neutral-600 hover:bg-neutral-800/40 hover:text-neutral-400'
                }`}
              >
                {pageNum + 1}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 rounded-lg bg-black/40 border border-neutral-800/60 text-neutral-500 hover:bg-emerald-950/30 hover:border-emerald-900/40 hover:text-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Página Principal
const AlertsPage: React.FC = () => {
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null)

  const {
    alerts,
    loading,
    error,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    filters,
    setFilters,
    setPage,
    fetchAlerts,
    clearFilters
  } = useFraudAlerts({ autoFetch: true })

  const handleFilterChange = (newFilters: FraudAlertFilterRequestDTO) => {
    setFilters(newFilters)
    setPage(0)
  }

  const handleToggleExpand = (alertId: string) => {
    setExpandedAlertId(prev => prev === alertId ? null : alertId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#09140e] to-black py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Navbar />

      {/* Background Effects - Subtle emerald glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[200px] bg-emerald-950/20 -top-64 -left-64" />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[200px] bg-emerald-950/15 top-1/2 -right-64" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[200px] bg-emerald-950/10 bottom-0 left-1/3" />
      </div>

      {/* Grid Pattern - Darker */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      <div className="max-w-7xl mx-auto relative z-10 mt-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/30 border border-emerald-900/30 mb-6">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-500/80">Sistema de Monitoramento</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
              Alertas de Fraude
            </span>
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Monitoramento em tempo real de transações suspeitas
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/60 hover:border-emerald-900/30 transition-colors">
            <div className="text-2xl font-bold text-neutral-100">{totalElements}</div>
            <div className="text-sm text-neutral-600">Total de Alertas</div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/60 hover:border-red-900/30 transition-colors">
            <div className="text-2xl font-bold text-red-500">
              {alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length}
            </div>
            <div className="text-sm text-neutral-600">Alto Risco</div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/60 hover:border-yellow-900/30 transition-colors">
            <div className="text-2xl font-bold text-yellow-500">
              {alerts.filter(a => a.status === 'PENDING').length}
            </div>
            <div className="text-sm text-neutral-600">Pendentes</div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/60 hover:border-emerald-900/30 transition-colors">
            <div className="text-2xl font-bold text-emerald-500">
              {alerts.reduce((acc, a) => acc + a.fraudScore, 0) / (alerts.length || 1) | 0}
            </div>
            <div className="text-sm text-neutral-600">Score Médio</div>
          </div>
        </div>

        {/* Filters */}
        <Filters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={clearFilters}
          onRefresh={fetchAlerts}
          loading={loading}
        />

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-900/40 text-red-400 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && alerts.length === 0 && (
          <div className="text-center py-20 bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/60 rounded-2xl">
            <Shield className="w-16 h-16 mx-auto mb-4 text-neutral-700" />
            <h3 className="text-xl font-semibold text-neutral-300 mb-2">
              Nenhum alerta encontrado
            </h3>
            <p className="text-neutral-600 mb-6">
              Tente ajustar os filtros ou aguarde novas transações suspeitas
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/40 transition-all cursor-pointer"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* Alerts List */}
        {!loading && alerts.length > 0 && (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <AlertCard
                key={alert.id || index}
                alert={alert}
                isExpanded={expandedAlertId === (alert.id || String(index))}
                onToggle={() => handleToggleExpand(alert.id || String(index))}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default AlertsPage