import React, { useState } from 'react'
import GlobeComponent from '../../components/transactions-components/Globe'
import Navbar from '../../components/navbar-components/NavBar'

function TransactionsMonitorPage() {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    dispositivo: '',
    cartao: '',
    valor: '',
    local: ''
  })

  const handleManualTransaction = () => {
    setShowModal(true)
  }

  const handleRandomTransaction = () => {
    console.log('Gerando transação aleatória...')
  }

  const handleSubmit = () => {
    console.log('Transação manual:', formData)
    setShowModal(false)
    setFormData({ dispositivo: '', cartao: '', valor: '', local: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#03160a] to-black">
      <Navbar />
      <GlobeComponent transactions={[
        { lat: 37.7749, lng: -122.4194, cardBrand: 'Visa', ipAddress: '192.168.1.1' },
        { lat: -21.203786, lng: -42.865677, cardBrand: 'Mastercard', ipAddress: '192.168.1.2' },
        { lat: -22.203786, lng: -43.865677, cardBrand: 'Elo', ipAddress: '192.168.1.3' },
        { lat: 51.5074, lng: -0.1278, cardBrand: 'Visa', ipAddress: '192.168.1.4' },
        { lat: 35.6895, lng: 139.6917, cardBrand: 'Mastercard', ipAddress: '192.168.1.5' },
      ]} />

      {/* Botões centralizados na parte inferior - Responsivo */}
      <div className="fixed bottom-6 sm:bottom-10 left-0 right-0 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 z-10 px-4">
        <button
          onClick={handleRandomTransaction}
          className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-emerald-950/40 backdrop-blur-xl border border-emerald-800/20 text-emerald-400/80 font-semibold rounded-full shadow-lg shadow-emerald-950/20 hover:bg-emerald-900/40 hover:border-emerald-700/30 hover:scale-105 transition-all duration-300 overflow-hidden"
        >
          <span className="relative flex items-center justify-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm sm:text-base">Gerar Transação Aleatória</span>
          </span>
        </button>
        
        <button
          onClick={handleManualTransaction}
          className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-emerald-950/40 backdrop-blur-xl border border-emerald-800/20 text-emerald-400/80 font-semibold rounded-full shadow-lg shadow-emerald-950/20 hover:bg-emerald-900/40 hover:border-emerald-700/30 hover:scale-105 transition-all duration-300 overflow-hidden"
        >
          <span className="relative flex items-center justify-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm sm:text-base">Gerar Transação Manual</span>
          </span>
        </button>
      </div>

      {/* Modal com backdrop animado - Responsivo */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative bg-gradient-to-br from-emerald-950/90 via-emerald-900/80 to-emerald-950/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-emerald-800/20 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Efeito de brilho no topo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"></div>
            
            {/* Botão fechar */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-emerald-400/60 hover:text-emerald-300 transition-colors duration-200"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Título com ícone */}
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="p-2.5 sm:p-3 bg-emerald-900/40 backdrop-blur-xl rounded-xl border border-emerald-700/30 shadow-lg shadow-emerald-950/30">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400/90 via-emerald-300/80 to-emerald-500/90 bg-clip-text text-transparent">
                Nova Transação Manual
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* Dispositivo */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-emerald-300/70">
                  Dispositivo
                </label>
                <div className="relative">
                  <select
                    name="dispositivo"
                    value={formData.dispositivo}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 bg-emerald-950/40 backdrop-blur-xl text-emerald-200/90 text-sm sm:text-base rounded-xl border border-emerald-800/20 focus:outline-none focus:ring-2 focus:ring-emerald-700/40 focus:border-emerald-700/40 transition-all duration-200 appearance-none cursor-pointer shadow-lg shadow-emerald-950/30"
                  >
                    <option value="" className="bg-emerald-950">Selecione um dispositivo</option>
                    <option value="mobile" className="bg-emerald-950">📱 Mobile</option>
                    <option value="desktop" className="bg-emerald-950">💻 Desktop</option>
                    <option value="tablet" className="bg-emerald-950">📲 Tablet</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-emerald-400/60 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Cartão */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-emerald-300/70">
                  Cartão de Crédito
                </label>
                <div className="relative">
                  <select
                    name="cartao"
                    value={formData.cartao}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 bg-emerald-950/40 backdrop-blur-xl text-emerald-200/90 text-sm sm:text-base rounded-xl border border-emerald-800/20 focus:outline-none focus:ring-2 focus:ring-emerald-700/40 focus:border-emerald-700/40 transition-all duration-200 appearance-none cursor-pointer shadow-lg shadow-emerald-950/30"
                  >
                    <option value="" className="bg-emerald-950">Selecione um cartão</option>
                    <option value="visa" className="bg-emerald-950">💳 Visa</option>
                    <option value="mastercard" className="bg-emerald-950">💳 Mastercard</option>
                    <option value="elo" className="bg-emerald-950">💳 Elo</option>
                    <option value="amex" className="bg-emerald-950">💳 American Express</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-emerald-400/60 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Valor */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-emerald-300/70">
                  Valor
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/60 font-medium text-sm sm:text-base">R$</span>
                  <input
                    type="number"
                    name="valor"
                    value={formData.valor}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-emerald-950/40 backdrop-blur-xl text-emerald-200/90 text-sm sm:text-base rounded-xl border border-emerald-800/20 focus:outline-none focus:ring-2 focus:ring-emerald-700/40 focus:border-emerald-700/40 transition-all duration-200 shadow-lg shadow-emerald-950/30"
                  />
                </div>
              </div>

              {/* Local */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-emerald-300/70">
                  Local da Transação
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-emerald-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    name="local"
                    value={formData.local}
                    onChange={handleChange}
                    placeholder="Ex: São Paulo, Brasil"
                    className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-emerald-950/40 backdrop-blur-xl text-emerald-200/90 text-sm sm:text-base rounded-xl border border-emerald-800/20 focus:outline-none focus:ring-2 focus:ring-emerald-700/40 focus:border-emerald-700/40 transition-all duration-200 shadow-lg shadow-emerald-950/30"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-emerald-800/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-950/40 backdrop-blur-xl text-emerald-300/70 text-sm sm:text-base font-semibold rounded-xl hover:bg-emerald-900/40 transition-all duration-200 border border-emerald-800/20 shadow-lg shadow-emerald-950/30"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-700/80 to-emerald-800/80 text-emerald-50 text-sm sm:text-base font-semibold rounded-xl hover:from-emerald-700/90 hover:to-emerald-800/90 hover:scale-105 transition-all duration-200 shadow-lg shadow-emerald-950/40"
                >
                  Criar Transação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default TransactionsMonitorPage