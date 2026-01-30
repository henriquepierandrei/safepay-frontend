import React, { useState, useEffect } from 'react';
import { 
  Shield, Search, ChevronRight, AlertTriangle, Zap, 
  Smartphone, User, AlertCircle, Activity, Filter, Sparkles, 
  TrendingUp, Eye, Copy, Check, X, Menu, BookOpen, 
  Terminal, Layers, Cpu, Radio, Fingerprint,
  CreditCard, MapPin, Wifi, BarChart3, Target
} from 'lucide-react';
import Navbar from '../../components/navbar-components/NavBar';

// Tipos
interface AlertRule {
  code: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  action: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  rules: AlertRule[];
}

// Função para calcular severidade baseada no score (igual ao enum Java)
const getSeverityFromScore = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (score >= 50) return 'critical';
  if (score >= 35) return 'high';
  if (score >= 20) return 'medium';
  return 'low';
};

// Alertas baseados exatamente no enum Java AlertType
const alertsFromEnum = [
  { code: 'HIGH_AMOUNT', score: 20, title: 'Valor Alto', description: 'Valor significativamente acima do histórico do cartão. O sistema analisa a média móvel dos últimos 90 dias de transações para identificar valores atípicos.', action: 'Verificação 2FA', category: 'value-limit' },
  { code: 'LIMIT_EXCEEDED', score: 40, title: 'Limite Excedido', description: 'Tentativa de transação acima do limite disponível. Inclui verificação de limite diário, mensal e total de crédito.', action: 'Bloqueio Automático', category: 'value-limit' },
  { code: 'CREDIT_LIMIT_REACHED', score: 40, title: 'Limite de Crédito Atingido', description: 'Limite de crédito atingido ou ultrapassado. Transação bloqueada preventivamente até liberação de limite.', action: 'Bloqueio + Notificação', category: 'value-limit' },
  
  { code: 'VELOCITY_ABUSE', score: 42, title: 'Abuso de Velocidade', description: 'Muitas transações em curto intervalo de tempo. Padrão típico de ataques automatizados ou uso de bots.', action: 'Bloqueio Temporário', category: 'frequency' },
  { code: 'BURST_ACTIVITY', score: 30, title: 'Atividade em Pico', description: 'Pico súbito de atividade fora do padrão histórico do usuário. Modelo de ML detecta anomalias comportamentais.', action: 'Análise Prioritária', category: 'frequency' },
  
  { code: 'LOCATION_ANOMALY', score: 20, title: 'Localização Anômala', description: 'Localização fora do padrão histórico do cartão. Baseado em geolocalização dos últimos 180 dias de uso.', action: 'Verificação SMS', category: 'geo' },
  { code: 'IMPOSSIBLE_TRAVEL', score: 45, title: 'Viagem Impossível', description: 'Distância incompatível com o tempo entre transações. Ex: São Paulo e Tokyo com intervalo de 30 minutos.', action: 'Bloqueio Imediato', category: 'geo' },
  { code: 'HIGH_RISK_COUNTRY', score: 40, title: 'País de Alto Risco', description: 'Transação originada em país classificado como alto risco por órgãos internacionais de combate à fraude.', action: 'Bloqueio + Verificação', category: 'geo' },
  
  { code: 'NEW_DEVICE_DETECTED', score: 10, title: 'Novo Dispositivo', description: 'Detecção de um dispositivo nunca utilizado anteriormente. Requer confirmação de identidade do usuário.', action: 'Autenticação Extra', category: 'device' },
  { code: 'DEVICE_FINGERPRINT_CHANGE', score: 25, title: 'Fingerprint Alterado', description: 'Alteração relevante no fingerprint do dispositivo. Mudanças em browser, OS, resolução ou plugins.', action: 'Verificação', category: 'device' },
  { code: 'TOR_OR_PROXY_DETECTED', score: 30, title: 'TOR/Proxy Detectado', description: 'Uso de VPN, proxy ou rede TOR para mascarar a origem real da conexão.', action: 'Bloqueio Condicional', category: 'device' },
  { code: 'MULTIPLE_CARDS_SAME_DEVICE', score: 50, title: 'Múltiplos Cartões no Dispositivo', description: 'Múltiplos cartões utilizados no mesmo dispositivo. Forte indicador de fraude em massa ou card testing.', action: 'Bloqueio Total', category: 'device' },
  
  { code: 'TIME_OF_DAY_ANOMALY', score: 6, title: 'Horário Atípico', description: 'Transação realizada em horário atípico para o usuário. Ex: compras às 3h da manhã sem histórico similar.', action: 'Log + Monitoramento', category: 'behavior' },
  
  { code: 'CARD_TESTING', score: 50, title: 'Teste de Cartão', description: 'Pequenas transações repetidas para validação do cartão. Padrão clássico de verificação antes de fraude maior.', action: 'Bloqueio Imediato', category: 'fraud' },
  { code: 'MICRO_TRANSACTION_PATTERN', score: 35, title: 'Padrão de Microtransações', description: 'Sequência de microtransações suspeitas. Valores muito baixos (R$0,50 - R$5) em sequência rápida.', action: 'Bloqueio + Análise', category: 'fraud' },
  { code: 'DECLINE_THEN_APPROVE_PATTERN', score: 38, title: 'Padrão Recusa-Aprovação', description: 'Múltiplas recusas seguidas de aprovação. Indica tentativa de força bruta ou engenharia social.', action: 'Alerta + Verificação', category: 'fraud' },
  
  { code: 'MULTIPLE_FAILED_ATTEMPTS', score: 25, title: 'Tentativas Falhas Consecutivas', description: 'Diversas tentativas falhas consecutivas. Erros de CVV, data de expiração ou número do cartão.', action: 'Cooldown + Alerta', category: 'operational' },
  { code: 'SUSPICIOUS_SUCCESS_AFTER_FAILURE', score: 35, title: 'Sucesso Após Falhas Suspeitas', description: 'Aprovação após sequência de falhas suspeitas. Requer investigação manual obrigatória.', action: 'Revisão Obrigatória', category: 'operational' },
  { code: 'EXPIRATION_DATE_APPROACHING', score: 25, title: 'Data de Expiração Próxima', description: 'Transação próxima da data de expiração do cartão. Pode indicar uso de dados vazados antigos.', action: 'Verificação Extra', category: 'operational' },
  
  { code: 'ANOMALY_MODEL_TRIGGERED', score: 30, title: 'Modelo de Anomalia Acionado', description: 'Modelo estatístico de ML detectou comportamento anômalo. Isolation Forest identificou outlier.', action: 'Análise + Hold', category: 'model' },
];

// Categorias organizadas
const categories: Category[] = [
  {
    id: 'value-limit',
    name: 'Valor & Limite',
    description: 'Regras relacionadas a valores monetários e limites de crédito',
    icon: <CreditCard className="w-5 h-5" />,
    gradient: 'from-emerald-500 to-teal-500',
    rules: alertsFromEnum
      .filter(a => a.category === 'value-limit')
      .map(a => ({ ...a, severity: getSeverityFromScore(a.score) })),
  },
  {
    id: 'frequency',
    name: 'Frequência & Velocidade',
    description: 'Detecção de padrões de velocidade e frequência anormais',
    icon: <Zap className="w-5 h-5" />,
    gradient: 'from-amber-500 to-orange-500',
    rules: alertsFromEnum
      .filter(a => a.category === 'frequency')
      .map(a => ({ ...a, severity: getSeverityFromScore(a.score) })),
  },
  {
    id: 'geo',
    name: 'Geolocalização',
    description: 'Análise geográfica e detecção de anomalias de localização',
    icon: <MapPin className="w-5 h-5" />,
    gradient: 'from-emerald-400 to-emerald-600',
    rules: alertsFromEnum
      .filter(a => a.category === 'geo')
      .map(a => ({ ...a, severity: getSeverityFromScore(a.score) })),
  },
  {
    id: 'device',
    name: 'Dispositivo & Rede',
    description: 'Análise de fingerprint de dispositivo e características de rede',
    icon: <Smartphone className="w-5 h-5" />,
    gradient: 'from-teal-500 to-emerald-500',
    rules: alertsFromEnum
      .filter(a => a.category === 'device')
      .map(a => ({ ...a, severity: getSeverityFromScore(a.score) })),
  },
  {
    id: 'behavior',
    name: 'Comportamento',
    description: 'Análise comportamental baseada em padrões do usuário',
    icon: <User className="w-5 h-5" />,
    gradient: 'from-emerald-600 to-teal-600',
    rules: alertsFromEnum
      .filter(a => a.category === 'behavior')
      .map(a => ({ ...a, severity: getSeverityFromScore(a.score) })),
  },
  {
    id: 'fraud',
    name: 'Padrões de Fraude',
    description: 'Detecção de padrões clássicos de fraude conhecidos',
    icon: <AlertTriangle className="w-5 h-5" />,
    gradient: 'from-red-500 to-rose-500',
    rules: alertsFromEnum
      .filter(a => a.category === 'fraud')
      .map(a => ({ ...a, severity: getSeverityFromScore(a.score) })),
  },
  {
    id: 'operational',
    name: 'Risco Operacional',
    description: 'Alertas de risco operacional e tentativas suspeitas',
    icon: <AlertCircle className="w-5 h-5" />,
    gradient: 'from-slate-400 to-zinc-500',
    rules: alertsFromEnum
      .filter(a => a.category === 'operational')
      .map(a => ({ ...a, severity: getSeverityFromScore(a.score) })),
  },
  {
    id: 'model',
    name: 'Machine Learning',
    description: 'Alertas gerados por modelos de inteligência artificial',
    icon: <Cpu className="w-5 h-5" />,
    gradient: 'from-emerald-500 to-green-500',
    rules: alertsFromEnum
      .filter(a => a.category === 'model')
      .map(a => ({ ...a, severity: getSeverityFromScore(a.score) })),
  },
];

// Configuração de severidade
const severityConfig = {
  low: { 
    label: 'Baixo', 
    color: 'from-emerald-500/20 to-emerald-900/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500',
    glow: 'shadow-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Monitoramento',
    icon: Eye
  },
  medium: { 
    label: 'Médio', 
    color: 'from-amber-500/20 to-amber-900/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    bg: 'bg-amber-500',
    glow: 'shadow-amber-500/20',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Verificação',
    icon: AlertCircle
  },
  high: { 
    label: 'Alto', 
    color: 'from-orange-500/20 to-orange-900/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    bg: 'bg-orange-500',
    glow: 'shadow-orange-500/20',
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    description: 'Ação Requerida',
    icon: AlertTriangle
  },
  critical: { 
    label: 'Crítico', 
    color: 'from-red-500/20 to-red-900/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    bg: 'bg-red-500',
    glow: 'shadow-red-500/20',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    description: 'Bloqueio Imediato',
    icon: X
  },
};

const DocumentationPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // Abrir sidebar por padrão em telas grandes
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

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
  const filteredRulesCount = filteredCategories.reduce((acc, cat) => acc + cat.rules.length, 0);

  const stats = {
    critical: categories.reduce((acc, cat) => acc + cat.rules.filter(r => r.severity === 'critical').length, 0),
    high: categories.reduce((acc, cat) => acc + cat.rules.filter(r => r.severity === 'high').length, 0),
    medium: categories.reduce((acc, cat) => acc + cat.rules.filter(r => r.severity === 'medium').length, 0),
    low: categories.reduce((acc, cat) => acc + cat.rules.filter(r => r.severity === 'low').length, 0),
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden">
      {/* Navbar */}
      <Navbar />
      
      {/* Background Effects - Apenas tons de verde/emerald */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#020a06] to-[#000000]" />
        
        {/* Subtle Grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px'
          }}
        />
        
        {/* Gradient Orbs - Apenas emerald/verde */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-800/15 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-[200px]" />
      </div>

      {/* Overlay para fechar sidebar em mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Layout */}
      <div className="relative z-10 flex pt-16">
        
        {/* Sidebar */}
        <aside 
          className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-72 bg-[#000000]/95 backdrop-blur-2xl border-r border-emerald-900/20 transition-all duration-300 z-40 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 sm:p-6 h-full overflow-y-auto custom-scrollbar">
            {/* Logo Section */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-900/20">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-black" />
              </div>
              <div>
                <h1 className="font-bold text-white text-base">SafePay</h1>
                <p className="text-[10px] text-white/40 font-medium">Fraud Detection v2.0</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 px-2">
                Categorias
              </p>
              {categories.map((category, index) => {
                const categoryRulesCount = category.rules.length;
                const isActive = activeCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(isActive ? null : category.id);
                      const element = document.getElementById(`category-${category.id}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                      isActive 
                        ? 'bg-emerald-500/10 text-white border border-emerald-500/20' 
                        : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                    }`}
                    style={{ 
                      opacity: isLoaded ? 1 : 0,
                      transform: isLoaded ? 'translateX(0)' : 'translateX(-10px)',
                      transition: `all 0.3s ease ${index * 0.05}s`
                    }}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all shadow-lg shrink-0`}>
                      {category.icon}
                    </div>
                    <span className="flex-1 text-left font-medium truncate text-xs sm:text-sm">{category.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md transition-colors ${
                      isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.04] text-white/40'
                    }`}>
                      {categoryRulesCount}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Stats Card */}
            <div className="mt-6 p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/20">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-emerald-400/60" />
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Severidade</p>
              </div>
              <div className="space-y-2">
                {Object.entries(severityConfig).reverse().map(([key, config]) => {
                  const count = stats[key as keyof typeof stats];
                  const percentage = (count / totalRules) * 100;
                  
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${config.bg}`} />
                          <span className="text-[10px] text-white/70 font-medium">{config.label}</span>
                        </div>
                        <span className="text-[10px] font-bold text-white/90">{count}</span>
                      </div>
                      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${config.bg} rounded-full transition-all duration-1000`}
                          style={{ 
                            width: isLoaded ? `${percentage}%` : '0%',
                            transitionDelay: '0.5s'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info Card */}
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-emerald-400 mb-0.5">Precisão do Sistema</p>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Taxa de detecção de 99.7%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>

          {/* Hero Section */}
          <section className={`relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 overflow-hidden transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Hero Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-transparent to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            
            <div className="relative max-w-5xl mx-auto">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mb-6 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 transition-all duration-200"
              >
                <Menu className="w-5 h-5 text-emerald-400" />
              </button>

              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8 lg:gap-12">
                <div className="flex-1">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-xs sm:text-sm font-semibold">Documentação Técnica v2.0</span>
                  </div>
                  
                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-[1.1]">
                    <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
                      Regras de
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                      Bloqueio
                    </span>
                  </h1>
                  
                  {/* Description */}
                  <p className="text-sm sm:text-base lg:text-lg text-white/40 max-w-2xl leading-relaxed mb-6 sm:mb-10">
                    Sistema de detecção de fraudes em tempo real com{' '}
                    <span className="text-emerald-400 font-semibold">{totalRules} regras</span> de proteção 
                    distribuídas em <span className="text-white/60 font-medium">{categories.length} categorias</span>.
                  </p>

                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8">
                    {[
                      { icon: AlertTriangle, label: 'Críticas', value: stats.critical, colorClass: 'bg-red-500/10 border-red-500/20 text-red-400' },
                      { icon: TrendingUp, label: 'Altas', value: stats.high, colorClass: 'bg-orange-500/10 border-orange-500/20 text-orange-400' },
                      { icon: Activity, label: 'Precisão', value: '99.7%', colorClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
                    ].map((stat, index) => (
                      <div 
                        key={stat.label}
                        className="flex items-center gap-3"
                        style={{
                          opacity: isLoaded ? 1 : 0,
                          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                          transition: `all 0.5s ease ${0.3 + index * 0.1}s`
                        }}
                      >
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl ${stat.colorClass} border flex items-center justify-center`}>
                          <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        </div>
                        <div>
                          <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white">{stat.value}</p>
                          <p className="text-xs sm:text-sm text-white/40">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hero Visual - Hidden on smaller screens */}
                <div className="hidden xl:block relative">
                  <div className="relative w-56 h-56 2xl:w-72 2xl:h-72">
                    {/* Animated Rings */}
                    {[0, 1, 2].map((i) => (
                      <div 
                        key={i}
                        className="absolute rounded-full border border-emerald-500/20"
                        style={{
                          inset: `${i * 20}px`,
                          animation: `ping 3s ease-in-out infinite`,
                          animationDelay: `${i * 0.4}s`
                        }}
                      />
                    ))}
                    
                    {/* Center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 2xl:w-28 2xl:h-28 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-float">
                        <Shield className="w-10 h-10 2xl:w-14 2xl:h-14 text-white" />
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute top-2 right-2 w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-float">
                      <Fingerprint className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="absolute bottom-2 left-2 w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
                      <MapPin className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="absolute top-1/2 -left-4 w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                      <Cpu className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="absolute bottom-8 right-0 w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
                      <Wifi className="w-4 h-4 text-teal-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Search and Filters */}
          <section className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-y border-emerald-900/20 bg-[#000000]/90 backdrop-blur-2xl sticky top-16 z-20">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col gap-4">
                {/* Search Input */}
                <div className="relative w-full">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/30" />
                  <input
                    type="text"
                    placeholder="Buscar regras..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-emerald-950/30 border border-emerald-900/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all duration-200 text-sm"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-white/40" />
                    </button>
                  )}
                </div>

                {/* Severity Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap">
                  <div className="flex items-center gap-1.5 mr-2 shrink-0">
                    <Filter className="w-3.5 h-3.5 text-white/30" />
                    <span className="text-xs text-white/40 hidden sm:inline">Severidade:</span>
                  </div>
                  
                  <button
                    onClick={() => setSelectedSeverity(null)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 shrink-0 ${
                      !selectedSeverity 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'text-white/40 hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    Todos
                  </button>
                  
                  {Object.entries(severityConfig).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedSeverity(selectedSeverity === key ? null : key)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 border shrink-0 ${
                        selectedSeverity === key 
                          ? `${config.badge}` 
                          : 'text-white/40 hover:text-white hover:bg-white/[0.04] border-transparent'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${config.bg}`} />
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Info */}
              {(searchTerm || selectedSeverity) && (
                <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-white/50">
                    <span className="text-emerald-400 font-semibold">{filteredRulesCount}</span> regras
                  </span>
                  {searchTerm && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/50 text-white/50 text-xs font-mono truncate max-w-[150px]">
                      "{searchTerm}"
                    </span>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Categories Content */}
          <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
              {filteredCategories.map((category, categoryIndex) => (
                <div 
                  key={category.id}
                  id={`category-${category.id}`}
                  className="scroll-mt-36 sm:scroll-mt-48"
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
                    transition: `all 0.6s ease ${0.1 + categoryIndex * 0.1}s`
                  }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 sm:gap-5 mb-4 sm:mb-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-xl shrink-0`}>
                      {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-0.5 truncate">{category.name}</h2>
                      <p className="text-xs sm:text-sm text-white/40 truncate">{category.description}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-900/20 shrink-0">
                      <Layers className="w-3.5 h-3.5 text-white/40" />
                      <span className="text-white/60 text-xs font-medium">{category.rules.length}</span>
                    </div>
                  </div>

                  {/* Rules Grid */}
                  <div className="grid gap-3 sm:gap-4">
                    {category.rules.map((rule, ruleIndex) => {
                      const severity = severityConfig[rule.severity];
                      const SeverityIcon = severity.icon;
                      
                      return (
                        <div
                          key={rule.code}
                          className={`group relative p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${severity.color} border ${severity.border} hover:border-opacity-60 transition-all duration-300 hover:shadow-xl ${severity.glow} backdrop-blur-sm`}
                          style={{
                            opacity: isLoaded ? 1 : 0,
                            transform: isLoaded ? 'translateX(0)' : 'translateX(-20px)',
                            transition: `all 0.4s ease ${0.2 + ruleIndex * 0.05}s`
                          }}
                        >
                          <div className="flex flex-col gap-4">
                            {/* Header */}
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${severity.color} border ${severity.border} flex items-center justify-center shrink-0`}>
                                <SeverityIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${severity.text}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-white text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">
                                  {rule.title}
                                </h3>
                                <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
                                  {rule.description}
                                </p>
                              </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-2 pl-11 sm:pl-13">
                              {/* Score */}
                              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/[0.08]">
                                <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/40" />
                                <span className="text-[10px] sm:text-xs text-white/50">Score</span>
                                <span className={`text-xs sm:text-sm font-bold ${severity.text}`}>{rule.score}</span>
                              </div>

                              {/* Action */}
                              <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/[0.08] text-[10px] sm:text-xs text-white/50 font-medium">
                                {rule.action}
                              </div>

                              {/* Severity Badge */}
                              <div className={`px-2.5 py-1.5 rounded-lg border text-[10px] sm:text-xs font-bold ${severity.badge}`}>
                                {severity.label}
                              </div>

                              {/* Code - Copyable */}
                              <button 
                                onClick={() => copyToClipboard(rule.code)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-200 group/code"
                              >
                                <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/30" />
                                <code className="text-[10px] sm:text-xs font-mono text-emerald-400/90 max-w-[80px] sm:max-w-none truncate">{rule.code}</code>
                                {copiedCode === rule.code ? (
                                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/20 group-hover/code:text-white/50 transition-colors" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {filteredCategories.length === 0 && (
                <div className="text-center py-16 sm:py-24">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-emerald-950/30 border border-emerald-900/20 mb-6 sm:mb-8">
                    <Search className="w-8 h-8 sm:w-12 sm:h-12 text-white/20" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Nenhuma regra encontrada</h3>
                  <p className="text-white/40 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base px-4">
                    Tente ajustar os filtros ou termos de busca.
                  </p>
                  <button 
                    onClick={() => { setSearchTerm(''); setSelectedSeverity(null); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200 text-sm font-semibold"
                  >
                    <X className="w-4 h-4" />
                    Limpar Filtros
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Severity Legend Section */}
          <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-emerald-900/20">
            <div className="max-w-5xl mx-auto">
              <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-emerald-950/20 border border-emerald-900/20">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Classificação de Severidade</h3>
                    <p className="text-xs sm:text-sm text-white/40">Baseada no score de risco</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {Object.entries(severityConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    const scoreRange = key === 'critical' ? '≥ 50' : key === 'high' ? '35-49' : key === 'medium' ? '20-34' : '< 20';
                    
                    return (
                      <div 
                        key={key}
                        className={`p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br ${config.color} border ${config.border} transition-all hover:scale-[1.02]`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg ${config.bg}/20 flex items-center justify-center`}>
                            <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${config.text}`} />
                          </div>
                          <span className={`font-bold text-xs sm:text-sm ${config.text}`}>{config.label}</span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-white/40 mb-1.5 sm:mb-2">{config.description}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-wider">Score:</span>
                          <span className={`text-xs sm:text-sm font-mono font-bold ${config.text}`}>{scoreRange}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 border-t border-emerald-900/20 bg-black/50">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm sm:text-base">SafePay Fraud Detection</p>
                    <p className="text-white/30 text-xs sm:text-sm">Proteção em tempo real</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/30">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/50 font-mono">v2.0.0</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{totalRules} regras</span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        
        @keyframes ping {
          0% { opacity: 1; transform: scale(1); }
          75%, 100% { opacity: 0; transform: scale(1.5); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.3);
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #000000;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.15);
          border-radius: 4px;
          border: 2px solid #000000;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.25);
        }

        ::selection {
          background: rgba(16, 185, 129, 0.3);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default DocumentationPage;