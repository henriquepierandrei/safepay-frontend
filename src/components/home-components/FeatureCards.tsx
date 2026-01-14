import React from 'react';
import { Layers, Zap, Shield, Sparkles, Rocket, Target } from 'lucide-react';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface FeatureCardsProps {
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  {
    id: 1,
    title: 'Fast Performance',
    description: 'Modern design with smooth animations and responsive layout for all devices',
    icon: <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400/80" />
  },
  {
    id: 2,
    title: 'Secure & Safe',
    description: 'Built with security best practices and modern encryption standards',
    icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400/80" />
  },
  {
    id: 3,
    title: 'Beautiful UI',
    description: 'Stunning glassmorphism design with dark mode and smooth transitions',
    icon: <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400/80" />
  },
  {
    id: 4,
    title: 'Easy to Use',
    description: 'Intuitive interface designed for the best user experience possible',
    icon: <Target className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400/80" />
  },
  {
    id: 5,
    title: 'Blazing Fast',
    description: 'Optimized performance with cutting-edge technology and architecture',
    icon: <Rocket className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400/80" />
  },
  {
    id: 6,
    title: 'Fully Responsive',
    description: 'Works perfectly on mobile, tablet, desktop and all screen sizes',
    icon: <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400/80" />
  }
];

const FeatureCards: React.FC<FeatureCardsProps> = ({ features = defaultFeatures }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400/90 via-emerald-300/80 to-emerald-500/90 bg-clip-text text-transparent">
              Amazing Features
            </span>
          </h2>
          <p className="text-base sm:text-lg text-emerald-200/50 max-w-2xl mx-auto">
            Discover what makes our platform stand out from the rest
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="group p-6 sm:p-8 rounded-3xl bg-black/50 backdrop-blur-xl border border-emerald-800/15 hover:border-emerald-700/25 transition-all duration-500 hover:scale-105 shadow-xl shadow-black/30 hover:shadow-emerald-950/30"
            >
              {/* Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-900/30 to-emerald-950/30 border border-emerald-800/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon || <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400/80" />}
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-emerald-50/80 mb-2 sm:mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-emerald-200/50">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;