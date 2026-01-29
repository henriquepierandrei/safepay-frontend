import React from 'react';
import { Rocket, FileText, Github, ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onPrimaryClick, onSecondaryClick }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-3xl bg-emerald-900/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-emerald-900/30 via-black/50 to-emerald-950/30 backdrop-blur-xl border border-emerald-800/20 shadow-2xl shadow-emerald-950/30">
          {/* Content */}
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/60 border border-emerald-700/30">
              <Rocket className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400/80 font-medium">
                Comece Agora
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <span className="text-emerald-50/90">Pronto para </span>
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                Explorar?
              </span>
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-emerald-200/50 max-w-2xl mx-auto">
              Teste o simulador de detecção de fraudes em tempo real ou acesse a documentação completa para entender toda a arquitetura do sistema.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                onClick={onPrimaryClick}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Acessar Simulador
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onSecondaryClick}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-950/50 border border-emerald-700/30 text-emerald-400/90 font-semibold hover:bg-emerald-900/40 hover:border-emerald-600/40 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Ver Documentação
              </button>
            </div>

            {/* GitHub Link */}
            <div className="pt-6">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-emerald-200/40 hover:text-emerald-400/80 transition-colors duration-300"
              >
                <Github className="w-5 h-5" />
                <span className="text-sm">Contribua no GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;