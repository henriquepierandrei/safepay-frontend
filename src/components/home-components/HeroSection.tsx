import { ClosedCaption, IdCard, Lock } from 'lucide-react';
import React from 'react';

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
    <section className="pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full blur-3xl bg-emerald-900/15 -top-48 -left-48 animate-float" />
        <div className="absolute w-80 h-80 rounded-full blur-3xl bg-emerald-800/10 top-1/3 -right-40 animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-block">
            <div className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-emerald-950/40 border border-emerald-800/20 backdrop-blur-xl">
              <span className="text-sm sm:text-base text-emerald-400/80 font-medium">
                <Lock className="inline-block mr-2" /> Sistema Antifraude para Cartões de Crédito
              </span>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-emerald-400/90 via-emerald-300/80 to-emerald-500/90 bg-clip-text text-transparent">
              {title}
            </span>
            <br />
            <span className="text-emerald-50/80">{subtitle}</span>
          </h1>
          
          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-emerald-200/50 max-w-2xl mx-auto px-4">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button 
              onClick={onPrimaryClick}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-emerald-700/80 to-emerald-800/80 text-emerald-50 font-semibold shadow-lg shadow-emerald-950/40 hover:shadow-emerald-900/50 hover:scale-105 transition-all duration-300"
            >
              {primaryButtonText}
            </button>
            <button 
              onClick={onSecondaryClick}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-950/40 border border-emerald-800/20 text-emerald-400/80 font-semibold hover:bg-emerald-900/40 hover:border-emerald-700/30 transition-all duration-300"
            >
              {secondaryButtonText}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;