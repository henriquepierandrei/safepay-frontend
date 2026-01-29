import React, { useState } from 'react';
import { Shield, Search, ChevronDown, AlertTriangle, Lock, Zap, Globe, Smartphone, User, AlertCircle, Settings, Activity } from 'lucide-react';
import Navbar from '../../components/navbar-components/NavBar';

interface AlertRule {
  code: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  rules: AlertRule[];
}

const categories: Category[] = [
  {
    id: 'value-limit',
    name: 'Valor & Limite',
    icon: <Lock className="w-6 h-6" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    borderColor: 'border-emerald-800/20',
    rules: [
      { code: 'HIGH_AMOUNT', title: 'Valor Alto', description: 'Transação com valor significativamente acima do padrão histórico do cartão', severity: 'high' },
      { code: 'LIMIT_EXCEEDED', title: 'Limite Excedido', description: 'Tentativa de transação acima do limite de crédito disponível', severity: 'critical' },
      { code: 'SUDDEN_AMOUNT_SPIKE', title: 'Pico Súbito de Valor', description: 'Aumento abrupto no valor médio das transações em curto período', severity: 'high' },
      { code: 'ROUND_AMOUNT_ANOMALY', title: 'Valor Redondo Atípico', description: 'Valor "redondo" atípico (ex: 1000, 5000), comum em testes de fraude', severity: 'medium' },
    ]
  },
  {
    id: 'frequency-speed',
    name: 'Frequência & Velocidade',
    icon: <Zap className="w-6 h-6" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    borderColor: 'border-emerald-800/20',
    rules: [
      { code: 'VELOCITY_ABUSE', title: 'Abuso de Velocidade', description: 'Muitas transações em um curto intervalo de tempo', severity: 'critical' },
      { code: 'RAPID_FIRE_TRANSACTIONS', title: 'Transações em Rajada', description: 'Sequência extremamente rápida de transações consecutivas', severity: 'critical' },
      { code: 'BURST_ACTIVITY', title: 'Atividade em Pico', description: 'Pico súbito de atividade fora do comportamento normal', severity: 'high' },
      { code: 'TRANSACTION_FREQUENCY_ANOMALY', title: 'Frequência Anômala', description: 'Frequência de transações acima do padrão esperado', severity: 'medium' },
    ]
  },
  {
    id: 'location-geo',
    name: 'Localização & Geo',
    icon: <Globe className="w-6 h-6" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    borderColor: 'border-emerald-800/20',
    rules: [
      { code: 'LOCATION_ANOMALY', title: 'Localização Anômala', description: 'Transação em localização geográfica incomum para o cartão', severity: 'medium' },
      { code: 'IMPOSSIBLE_TRAVEL', title: 'Viagem Impossível', description: 'Transações em locais distantes em intervalo incompatível com deslocamento físico', severity: 'critical' },
      { code: 'COUNTRY_MISMATCH', title: 'País Diferente', description: 'País diferente do histórico ou do país de emissão do cartão', severity: 'high' },
      { code: 'HIGH_RISK_COUNTRY', title: 'País de Alto Risco', description: 'Transação originada de país classificado como alto risco', severity: 'critical' },
    ]
  },
  {
    id: 'device-network',
    name: 'Dispositivo & Rede',
    icon: <Smartphone className="w-6 h-6" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    borderColor: 'border-emerald-800/20',
    rules: [
      { code: 'NEW_DEVICE_DETECTED', title: 'Novo Dispositivo', description: 'Transação realizada a partir de um dispositivo nunca visto antes', severity: 'low' },
      { code: 'DEVICE_FINGERPRINT_CHANGE', title: 'Fingerprint Alterado', description: 'Alteração significativa no fingerprint do dispositivo', severity: 'medium' },
      { code: 'IP_ANOMALY', title: 'IP Anômalo', description: 'Endereço IP incomum ou fora do padrão do usuário', severity: 'medium' },
      { code: 'TOR_OR_PROXY_DETECTED', title: 'TOR/Proxy Detectado', description: 'Uso de VPN, proxy ou rede TOR para ocultar origem', severity: 'high' },
      { code: 'MULTIPLE_CARDS_SAME_DEVICE', title: 'Múltiplos Cartões', description: 'Vários cartões usados no mesmo dispositivo (indicador de fraude em massa)', severity: 'critical' },
    ]
  },
  {
    id: 'user-behavior',
    name: 'Comportamento do Usuário',
    icon: <User className="w-6 h-6" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    borderColor: 'border-emerald-800/20',
    rules: [
      { code: 'UNUSUAL_MERCHANT', title: 'Estabelecimento Incomum', description: 'Estabelecimento fora do perfil de consumo do cartão', severity: 'low' },
      { code: 'UNUSUAL_MERCHANT_CATEGORY', title: 'Categoria Incomum', description: 'Categoria de comerciante incomum para o histórico do usuário', severity: 'low' },
      { code: 'TIME_OF_DAY_ANOMALY', title: 'Horário Atípico', description: 'Transação realizada em horário atípico (ex: madrugada)', severity: 'medium' },
      { code: 'WEEKEND_ANOMALY', title: 'Anomalia de Fim de Semana', description: 'Atividade em finais de semana fora do padrão histórico', severity: 'low' },
    ]
  },
  {
    id: 'fraud-patterns',
    name: 'Padrões de Fraude Clássicos',
    icon: <AlertTriangle className="w-6 h-6" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    borderColor: 'border-emerald-800/20',
    rules: [
      { code: 'CARD_TESTING', title: 'Teste de Cartão', description: 'Pequenas transações repetidas para testar validade do cartão', severity: 'critical' },
      { code: 'MICRO_TRANSACTION_PATTERN', title: 'Micro Transações', description: 'Várias transações de valor muito baixo em sequência', severity: 'high' },
      { code: 'REVERSAL_ABUSE', title: 'Abuso de Estornos', description: 'Muitos estornos ou cancelamentos em curto período', severity: 'high' },
      { code: 'DECLINE_THEN_APPROVE_PATTERN', title: 'Recusa-Aprovação', description: 'Várias tentativas recusadas seguidas de aprovação', severity: 'high' },
    ]
  },
  {
    id: 'operational-risk',
    name: 'Risco Operacional',
    icon: <AlertCircle className="w-6 h-6" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    borderColor: 'border-emerald-800/20',
    rules: [
      { code: 'MULTIPLE_FAILED_ATTEMPTS', title: 'Tentativas Falhas', description: 'Diversas tentativas falhas consecutivas', severity: 'medium' },
      { code: 'SUSPICIOUS_SUCCESS_AFTER_FAILURE', title: 'Sucesso Suspeito', description: 'Transação aprovada após múltiplas falhas suspeitas', severity: 'high' },
      { code: 'MANUAL_REVIEW_REQUIRED', title: 'Revisão Manual', description: 'Caso marcado explicitamente para revisão humana', severity: 'medium' },
      { code: 'RULE_ENGINE_CONFLICT', title: 'Conflito de Regras', description: 'Conflito entre regras de fraude (ex: score alto vs regra permissiva)', severity: 'medium' },
    ]
  },
  {
    id: 'score-model',
    name: 'Score & Modelo',
    icon: <Activity className="w-6 h-6" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    borderColor: 'border-emerald-800/20',
    rules: [
      { code: 'HIGH_FRAUD_SCORE', title: 'Score Alto de Fraude', description: 'Score de fraude acima do limite definido', severity: 'critical' },
      { code: 'MODEL_CONFIDENCE_LOW', title: 'Baixa Confiança', description: 'Modelo de detecção com baixa confiança na decisão', severity: 'medium' },
      { code: 'ANOMALY_MODEL_TRIGGERED', title: 'Modelo de Anomalia', description: 'Modelo de detecção de anomalias identificou padrão fora da normalidade', severity: 'high' },
    ]
  },
];

const severityConfig = {
  low: { label: 'Baixo', color: 'bg-emerald-900/30', textColor: 'text-emerald-400', dot: 'bg-emerald-400' },
  medium: { label: 'Médio', color: 'bg-emerald-800/40', textColor: 'text-emerald-300', dot: 'bg-emerald-300' },
  high: { label: 'Alto', color: 'bg-emerald-700/50', textColor: 'text-emerald-200', dot: 'bg-emerald-200' },
  critical: { label: 'Crítico', color: 'bg-emerald-600/60', textColor: 'text-emerald-100', dot: 'bg-emerald-100' },
};

const CardBlockingRules: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

  const filteredCategories = categories.map(category => ({
    ...category,
    rules: category.rules.filter(rule => {
      const matchesSearch = searchTerm === '' || 
        rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = !selectedSeverity || rule.severity === selectedSeverity;
      return matchesSearch && matchesSeverity;
    })
  })).filter(category => category.rules.length > 0);

  const totalRules = categories.reduce((acc, cat) => acc + cat.rules.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#09140e] to-black">
      <Navbar />
      <br /><br />
      {/* Background Effects - Same as HeroSection */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full blur-3xl bg-emerald-900/15 -top-48 -left-48 animate-float" />
        <div className="absolute w-80 h-80 rounded-full blur-3xl bg-emerald-800/10 top-1/3 -right-40 animate-float-delayed" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20 ">
        {/* Header */}
        <header className="border-b border-emerald-900/20 backdrop-blur-xl bg-emerald-950/20 " >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-4xl bg-emerald-900/30 backdrop-blur-xl border border-emerald-800/30 flex items-center justify-center shadow-lg shadow-emerald-950/30">
                  <Shield className="w-8 h-8 text-emerald-400/70" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400/90 via-emerald-300/80 to-emerald-500/90 bg-clip-text text-transparent">
                    Regras de Bloqueio
                  </h1>
                  <p className="text-emerald-200/50 text-sm mt-1">
                    Sistema de Detecção de Fraudes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-6 py-3 rounded-xl bg-emerald-950/40 border border-emerald-800/20 backdrop-blur-xl">
                  <span className="text-emerald-400/70 text-sm">Total de Regras:</span>
                  <span className="ml-2 text-emerald-300 font-semibold text-lg">{totalRules}</span>
                </div>
                <div className="px-6 py-3 rounded-xl bg-emerald-950/40 border border-emerald-800/20 backdrop-blur-xl">
                  <span className="text-emerald-400/70 text-sm">Categorias:</span>
                  <span className="ml-2 text-emerald-300 font-semibold text-lg">{categories.length}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400/50" />
              <input
                type="text"
                placeholder="Buscar regras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/20 text-emerald-100 placeholder-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:border-emerald-700/50 transition-all backdrop-blur-xl"
              />
            </div>

            {/* Severity Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedSeverity(null)}
                className={`px-5 py-3 rounded-xl text-sm font-medium transition-all backdrop-blur-xl ${
                  !selectedSeverity 
                    ? 'bg-emerald-700/50 text-emerald-100 border border-emerald-600/50 shadow-lg shadow-emerald-900/30' 
                    : 'bg-emerald-950/30 border border-emerald-800/20 text-emerald-400/70 hover:bg-emerald-900/30'
                }`}
              >
                Todos
              </button>
              {Object.entries(severityConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSeverity(selectedSeverity === key ? null : key)}
                  className={`px-5 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 backdrop-blur-xl ${
                    selectedSeverity === key 
                      ? `${config.color} ${config.textColor} border border-emerald-700/50 shadow-lg shadow-emerald-900/30` 
                      : 'bg-emerald-950/30 border border-emerald-800/20 text-emerald-400/70 hover:bg-emerald-900/30'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="p-6 rounded-4xl bg-emerald-950/30 border border-emerald-800/20 backdrop-blur-xl">
            <h3 className="text-sm font-semibold text-emerald-300/90 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Legenda de Severidade
            </h3>
            <div className="flex flex-wrap gap-6">
              {Object.entries(severityConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${config.dot} shadow-lg`}></span>
                  <span className={`text-sm font-medium ${config.textColor}`}>{config.label}</span>
                  <span className="text-emerald-400/40 text-xs">
                    {key === 'low' && '• Monitoramento'}
                    {key === 'medium' && '• Alerta'}
                    {key === 'high' && '• Ação Requerida'}
                    {key === 'critical' && '• Bloqueio Imediato'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className={`rounded-4xl border ${category.borderColor} ${category.bgColor} backdrop-blur-xl overflow-hidden transition-all duration-300 shadow-lg shadow-emerald-950/20 hover:shadow-emerald-900/30`}
              >
                {/* Category Header */}
                <button
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  className="w-full px-6 py-6 flex items-center justify-between hover:bg-emerald-900/20 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-800/30 text-emerald-400/80 group-hover:scale-110 group-hover:border-emerald-700/40 transition-all">
                      {category.icon}
                    </div>
                    <div className="text-left">
                      <h2 className={`text-xl font-bold ${category.color}`}>
                        {category.name}
                      </h2>
                      <p className="text-emerald-400/40 text-sm mt-0.5">
                        {category.rules.length} {category.rules.length === 1 ? 'regra' : 'regras'}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-emerald-400/50 transition-transform duration-300 ${
                      activeCategory === category.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Rules List */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeCategory === category.id ? 'max-h-[2000px]' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-6 space-y-3">
                    {category.rules.map((rule, index) => (
                      <div
                        key={rule.code}
                        className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-800/20 hover:border-emerald-700/30 hover:bg-emerald-900/20 transition-all group backdrop-blur-sm"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${severityConfig[rule.severity].dot} shadow-lg`}></span>
                              <h3 className="font-semibold text-emerald-100 group-hover:text-emerald-300 transition-colors">
                                {rule.title}
                              </h3>
                            </div>
                            <p className="text-emerald-200/50 text-sm leading-relaxed pl-5">
                              {rule.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 pl-5 sm:pl-0">
                            <code className="px-3 py-2 rounded-lg bg-emerald-950/60 text-xs font-mono text-emerald-400/70 border border-emerald-800/30">
                              {rule.code}
                            </code>
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${severityConfig[rule.severity].color} ${severityConfig[rule.severity].textColor} border border-emerald-700/30`}>
                              {severityConfig[rule.severity].label}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-4xl bg-emerald-950/40 border border-emerald-800/20 backdrop-blur-xl mb-6">
                <Search className="w-10 h-10 text-emerald-400/50" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-200/90 mb-2">Nenhuma regra encontrada</h3>
              <p className="text-emerald-400/50">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-emerald-900/20 bg-emerald-950/20 backdrop-blur-xl mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-900/30 border border-emerald-800/30">
                  <Shield className="w-5 h-5 text-emerald-400/70" />
                </div>
                <span className="text-emerald-400/60 text-sm">
                  SafePay Fraud Detection System
                </span>
              </div>
              <div className="text-emerald-400/40 text-sm">
                Documentação v1.0 • Atualizado em {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </footer>
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
      `}</style>
    </div>
  );
};

export default CardBlockingRules;