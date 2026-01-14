import React from 'react';
import { Lock, CreditCard, Shield, Zap, CheckCircle, TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Beautiful Design",
  subtitle = "Meets Functionality",
  description = "Experience a modern, responsive navigation system with glassmorphism effects and smooth animations",
  primaryButtonText = "Get Started",
  secondaryButtonText = "Learn More",
  onPrimaryClick,
  onSecondaryClick
}) => {
  return (
    <section className="min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full blur-3xl bg-emerald-900/15 -top-48 -left-48 animate-float" />
        <div className="absolute w-80 h-80 rounded-full blur-3xl bg-emerald-800/10 top-1/3 -right-40 animate-float-delayed" />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Icon 1 - Top Left */}
        <div className="absolute top-10 left-4 sm:top-20 sm:left-10 animate-float-slow">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-emerald-900/20 backdrop-blur-xl border border-emerald-700/20 flex items-center justify-center shadow-lg shadow-emerald-950/30">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-emerald-400/60" />
          </div>
        </div>

        {/* Icon 2 - Top Right */}
        <div className="absolute top-16 right-4 sm:top-32 sm:right-10 lg:right-20 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-emerald-900/20 backdrop-blur-xl border border-emerald-700/20 flex items-center justify-center shadow-lg shadow-emerald-950/30">
            <CreditCard className="w-5 h-5 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-emerald-400/60" />
          </div>
        </div>

        {/* Icon 3 - Middle Left */}
        <div className="absolute top-1/2 left-2 sm:left-10 lg:left-20 animate-float-delayed">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl bg-emerald-900/20 backdrop-blur-xl border border-emerald-700/20 flex items-center justify-center shadow-lg shadow-emerald-950/30">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-400/60" />
          </div>
        </div>

        {/* Icon 4 - Middle Right */}
        <div className="absolute top-1/2 right-2 sm:right-16 lg:right-32 animate-float-slow" style={{ animationDelay: '2s' }}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-emerald-900/20 backdrop-blur-xl border border-emerald-700/20 flex items-center justify-center shadow-lg shadow-emerald-950/30">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-emerald-400/60" />
          </div>
        </div>

        {/* Icon 5 - Bottom Left */}
        <div className="absolute bottom-20 left-4 sm:bottom-32 sm:left-16 lg:left-32 animate-float" style={{ animationDelay: '3s' }}>
          <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-emerald-900/20 backdrop-blur-xl border border-emerald-700/20 flex items-center justify-center shadow-lg shadow-emerald-950/30">
            <TrendingUp className="w-5 h-5 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-emerald-400/60" />
          </div>
        </div>

        {/* Icon 6 - Bottom Right */}
        <div className="absolute bottom-24 right-4 sm:bottom-20 sm:right-10 lg:right-16 animate-float-delayed" style={{ animationDelay: '1.5s' }}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl bg-emerald-900/20 backdrop-blur-xl border border-emerald-700/20 flex items-center justify-center shadow-lg shadow-emerald-950/30">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-400/60" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-block animate-fade-in">
            <div className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-emerald-950/40 border border-emerald-800/20 backdrop-blur-xl shadow-lg shadow-emerald-950/20 hover:scale-105 transition-transform duration-300">
              <span className="text-sm sm:text-base text-emerald-400/80 font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 animate-pulse" /> 
                Sistema Antifraude para Cartões de Crédito
              </span>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-slide-up">
            <span className="bg-gradient-to-r from-emerald-400/90 via-emerald-300/80 to-emerald-500/90 bg-clip-text text-transparent">
              {title}
            </span>
            <br />
            <span className="text-emerald-50/80">{subtitle}</span>
          </h1>
          
          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-emerald-200/50 max-w-2xl mx-auto px-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {description}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button 
              onClick={onPrimaryClick}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-emerald-700/80 to-emerald-800/80 text-emerald-50 font-semibold shadow-lg shadow-emerald-950/40 hover:shadow-emerald-900/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              {primaryButtonText}
            </button>
            <button 
              onClick={onSecondaryClick}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-950/40 border border-emerald-800/20 text-emerald-400/80 font-semibold hover:bg-emerald-900/40 hover:border-emerald-700/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Shield className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              {secondaryButtonText}
            </button>
          </div>
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
      `}</style>
    </section>
  );
};

export default HeroSection;