import React from 'react';
import { CreditCard, Cpu, Shield, CheckCircle, ArrowRight } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Captura da Transação',
    description: 'O sistema captura os dados da transação em tempo real, incluindo localização, valor, tipo de estabelecimento e histórico do usuário.',
    icon: <CreditCard className="w-8 h-8 text-emerald-400" />
  },
  {
    id: 2,
    title: 'Análise por Algoritmos',
    description: 'Algoritmos realizam uma análise detalhada dos dados utilizando regras inteligentes para identificar padrões suspeitos.',
    icon: <Cpu className="w-8 h-8 text-emerald-400" />
  },
    {
    id: 3,
    title: 'Avaliação de Risco',
    description: 'O sistema calcula uma pontuação de risco baseada em múltiplos fatores como valor, frequência, localização e histórico do usuário.',
    icon: <Shield className="w-8 h-8 text-emerald-400" />
  },
  {
    id: 4,
    title: 'Decisão Instantânea',
    description: 'Em menos de 50ms, a transação é aprovada, bloqueada ou enviada para revisão manual, garantindo segurança sem comprometer a experiência.',
    icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full blur-3xl bg-emerald-900/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-950/40 border border-emerald-800/20 text-emerald-400/80 text-sm font-medium mb-4">
            Processo de Detecção
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400/90 via-emerald-300/80 to-emerald-500/90 bg-clip-text text-transparent">
              Como Funciona
            </span>
          </h2>
          <p className="text-base sm:text-lg text-emerald-200/50 max-w-2xl mx-auto">
            Entenda o processo de detecção de fraudes em 4 etapas simples
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connector Line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-emerald-700/40 to-emerald-800/20">
                  <ArrowRight className="absolute -right-2 -top-2 w-5 h-5 text-emerald-600/40" />
                </div>
              )}

              {/* Step Card */}
              <div className="group p-6 sm:p-8 rounded-3xl bg-black/50 backdrop-blur-xl border border-emerald-800/15 hover:border-emerald-700/30 transition-all duration-500 hover:scale-105 shadow-xl shadow-black/30 h-full">
                {/* Step Number */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-900/40 border border-emerald-700/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                    {step.id}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-900/30 to-emerald-950/30 border border-emerald-800/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-emerald-50/80 mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-emerald-200/50 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;