import React, { useState, useEffect } from 'react';
import './NotFoundStyle.css';
import logo from '../../assets/logo.png';

const SplineBackground: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoaded(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#131314]">
      <img src="" alt="" />
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#100f16] z-50 transition-opacity duration-500">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-3 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
            <p className="text-green-300 text-sm font-medium tracking-widest uppercase">Loading</p>
          </div>
        </div>
      )}

      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(8, 58, 26, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 50%, rgba(6, 66, 46, 0.12) 0%, transparent 45%),
            radial-gradient(ellipse at 20% 80%, rgba(11, 66, 31, 0.14) 0%, transparent 45%),
            linear-gradient(180deg, #020d08 0%, #04130c 50%, #020d08 100%)`

        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(92, 246, 226, 0.03) 1px, transparent 1px);
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating Orbs with Parallax */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl bg-green-600/20 -top-48 -left-48 animate-float"
        style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
      />
      <div
        className="absolute w-80 h-80 rounded-full blur-3xl bg-green-600/15 top-1/3 -right-40 animate-float-delayed"
        style={{ transform: `translate(${mousePosition.x * 0.8}px, ${mousePosition.y * 0.8}px)` }}
      />
      <div
        className="absolute w-72 h-72 rounded-full blur-3xl bg-green-600/20 -bottom-36 left-1/4 animate-float-slow"
        style={{ transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)` }}
      />
      <div
        className="absolute w-64 h-64 rounded-full blur-3xl bg-green-600/15 bottom-1/4 right-1/4 animate-float"
        style={{ transform: `translate(${mousePosition.x * 0.6}px, ${mousePosition.y * 0.6}px)` }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#030014] pointer-events-none" />
    </div>
  );
};



// Ring Decorations Component
const RingDecorations: React.FC = () => (
  <>
    <div className="absolute top-20 left-20 w-24 h-24 border border-green-500/20 rounded-full animate-ring-pulse hidden lg:block" />
    <div className="absolute bottom-32 right-20 w-16 h-16 border border-green-500/20 rounded-full animate-ring-pulse hidden lg:block" style={{ animationDelay: '2s' }} />
    <div className="absolute top-1/2 left-10 w-12 h-12 border border-green-500/20 rounded-full animate-ring-pulse hidden lg:block" style={{ animationDelay: '1s' }} />
  </>
);

const NotFoundPage: React.FC = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden bg-[#0d1b14]">
        {/* 3D Background */}
        <SplineBackground />



        {/* Ring Decorations */}
        <RingDecorations />

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                        <img src={logo} alt="" width="100" className='absolute top-15 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />

          <div className="max-w-2xl w-full text-center">
            {/* 404 Text */}
            <div className="mb-6 relative">

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full bg-gradient-to-t from-[#030014] via-transparent to-transparent" />
              </div>
            </div>

            {/* Decorative Line */}
            <div className="h-px w-40 line-glow mx-auto mb-10 rounded-full animate-glow-pulse" />

            {/* Glass Card */}
            <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden">
              {/* Shimmer Effect */}
              <div className="absolute inset-0 animate-shimmer pointer-events-none" />              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                Página não encontrada
              </h2>
              <p className="text-base sm:text-lg text-gray-400 mb-10 leading-relaxed max-w-md mx-auto">
                Oops! A página que você está procurando não existe ou foi movida. Verifique o URL ou volte para a página inicial.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleGoHome}
                  className="btn-primary px-8 py-4 rounded-full font-semibold text-white w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </button>

                <button
                  onClick={handleGoBack}
                  className="btn-secondary px-8 py-4 rounded-full font-semibold text-violet-300 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar
                </button>
              </div>
            </div>

            {/* Error Code Footer */}
            <div className="mt-10 flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-gray-500 text-sm font-medium tracking-wide">
                Error Code: <span className="text-gray-400">404</span> | Página Não Existe
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#03110c] to-transparent pointer-events-none" />
      </div>
    </>
  );
};

export default NotFoundPage;