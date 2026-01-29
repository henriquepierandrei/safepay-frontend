import React from 'react';
import { Database, Brain, Server, Cloud, GitBranch, BarChart3, Coffee, Locate } from 'lucide-react';

interface Tech {
  id: number;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
}

const technologies: Tech[] = [
  {
    id: 1,
    name: 'Java & Spring Boot',
    category: 'Language & Framework',
    icon: <Coffee className="w-6 h-6 text-emerald-400" />,
    description: 'Backend robusto e escalável'
  },
  {
    id: 2,
    name: 'PostgreSQL',
    category: 'Database',
    icon: <Database className="w-6 h-6 text-emerald-400" />,
    description: 'Armazenamento de transações e histórico'
  },
  {
    id: 3,
    name: 'Caffeine',
    category: 'Cache',
    icon: <Cloud className="w-6 h-6 text-emerald-400" />,
    description: 'Cache de alta performance para decisões rápidas'
  },
  {
    id: 4,
    name: 'Nominatim',
    category: 'Api de Geolocalização',
    icon: <Locate className="w-6 h-6 text-emerald-400" />,
    description: 'Geocodificação reversa para localização'
  }
];

const TechStack: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-5 lg:px-8 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-950/40 border border-emerald-800/20 text-emerald-400/80 text-sm font-medium mb-4">
            Tecnologias
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400/90 via-emerald-300/80 to-emerald-500/90 bg-clip-text text-transparent">
              Stack Tecnológico
            </span>
          </h2>
          <p className="text-base sm:text-lg text-emerald-200/50 max-w-2xl mx-auto">
            Construído com as melhores ferramentas do mercado para garantir performance e escalabilidade
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-items-center max-w-4xl mx-auto">
          {technologies.map((tech) => (
            <div
              key={tech.id}
              className="group p-4 sm:p-6 rounded-2xl bg-black/50 backdrop-blur-xl border border-emerald-800/15 hover:border-emerald-700/30 transition-all duration-500 hover:scale-105 shadow-xl shadow-black/30 text-center w-full max-w-[200px]"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border border-emerald-800/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                {tech.icon}
              </div>

              {/* Category */}
              <div className="text-xs text-emerald-400/60 uppercase tracking-wider mb-1">
                {tech.category}
              </div>

              {/* Name */}
              <div className="text-sm font-semibold text-emerald-50/80 mb-2">
                {tech.name}
              </div>

              {/* Description - hidden on mobile */}
              <div className="hidden sm:block text-xs text-emerald-200/40">
                {tech.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;