// src/pages/globe/Globe.tsx

'use client'

import React, { Suspense, useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import './GlobeStyle.css'
import { useWebSocket } from '../../hooks/useWebSocket'
import countriesGeoJson from '../../data/countries.geo.json'
import TransactionNotification from '../../components/transactions-components/TransactionNotification'
import { playNotificationSound } from '../../utils/notificationSound'

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type Transaction = {
  lat: number
  lng: number
  cardBrand?: string
  ipAddress?: string
  country?: string
  city?: string
  amount?: number
  merchantCategory?: string
  severity?: string
  isFraud?: boolean
  decision?: string
}

type GlobeProps = {
  transactions: Transaction[]
}

interface NotificationItem {
  id: string
  transaction: Transaction
  timestamp: Date
}

/* -------------------------------------------------------------------------- */
/*                                 CONSTANTS                                  */
/* -------------------------------------------------------------------------- */

const EARTH_RADIUS = 2.5
const COUNTRY_RADIUS = 2.505
const TRANSACTION_RADIUS = 2.55

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

const geoToVector3 = (
  lat: number,
  lng: number,
  radius: number
): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

const generateId = () => Math.random().toString(36).substring(2, 11)

/* -------------------------------------------------------------------------- */
/*                                   EARTH                                    */
/* -------------------------------------------------------------------------- */

const EarthBase = () => (
  <group>
    <mesh>
      <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
      <meshStandardMaterial color="#020617" roughness={0.9} metalness={0.1} />
    </mesh>
  </group>
)

/* -------------------------------------------------------------------------- */
/*                               COUNTRY LINES                                */
/* -------------------------------------------------------------------------- */

const CountryLines = () => {
  const lines = useMemo(() => {
    const elements: React.ReactNode[] = []

    countriesGeoJson.features.forEach((feature: any, idx: number) => {
      const { coordinates, type } = feature.geometry

      const build = (coords: number[][], key: string) => {
        const points = coords.map(([lng, lat]) =>
          geoToVector3(lat, lng, COUNTRY_RADIUS)
        )

        const geometry = new THREE.BufferGeometry().setFromPoints(points)

        return (
          <line key={key}>
            <primitive object={geometry} attach="geometry" />
            <lineBasicMaterial
              color="white"
              transparent
              opacity={0.15}
            />
          </line>
        )
      }

      if (type === 'Polygon') {
        elements.push(build(coordinates[0], `p-${idx}`))
      }

      if (type === 'MultiPolygon') {
        coordinates.forEach((poly: any, i: number) => {
          elements.push(build(poly[0], `mp-${idx}-${i}`))
        })
      }
    })

    return elements
  }, [])

  return <group>{lines}</group>
}

/* -------------------------------------------------------------------------- */
/*                               TRANSACTIONS                                 */
/* -------------------------------------------------------------------------- */

const TransactionMarker = ({
  transaction,
  index,
  isSelected,
  onSelect,
  onClose,
  isNew
}: {
  transaction: Transaction
  index: number
  isSelected: boolean
  onSelect: () => void
  onClose: () => void
  isNew?: boolean
}) => {
  const ref = useRef<THREE.Group>(null)
  const pulseRef = useRef<THREE.Mesh>(null)

  const position = useMemo(
    () =>
      geoToVector3(
        transaction.lat,
        transaction.lng,
        TRANSACTION_RADIUS
      ),
    [transaction.lat, transaction.lng]
  )

  useFrame(({ clock }) => {
    if (!ref.current || isSelected) return
    ref.current.rotation.y =
      Math.sin(clock.elapsedTime * 2 + index) * 0.12
    
    // Animação de pulse para novos markers
    if (pulseRef.current && isNew) {
      const scale = 1 + Math.sin(clock.elapsedTime * 4) * 0.3
      pulseRef.current.scale.setScalar(scale)
    }
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    if (isSelected) {
      onClose()
    } else {
      onSelect()
    }
  }

  const getMarkerColor = () => {
    if (transaction.isFraud) return "#ef4444"
    if (transaction.severity === 'HIGH') return "#f97316"
    if (transaction.severity === 'MEDIUM') return "#eab308"
    return "#22c55e"
  }

  return (
    <group ref={ref} position={position} onClick={handleClick}>
      {/* Pulse ring para novos markers */}
      {isNew && (
        <mesh ref={pulseRef}>
          <ringGeometry args={[0.03, 0.05, 32]} />
          <meshBasicMaterial 
            color={getMarkerColor()} 
            transparent 
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      <mesh>
        <sphereGeometry args={[0.0225, 22, 22]} />
        <meshBasicMaterial color={isSelected ? "#4ade80" : getMarkerColor()} />
      </mesh>

      {isSelected && (
        <Html center distanceFactor={2}>
          {/* ... mesmo conteúdo do popup anterior ... */}
          <div
            className="rounded-lg border border-white/10 backdrop-blur-sm px-4 py-3 text-white transition-all duration-500 ease-out min-w-[250px] bg-black/80"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-black to-emerald-950 flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[9px] text-gray-400 uppercase tracking-wider">Transação</div>
                  <div className="text-xs font-semibold text-white uppercase">
                    {transaction.cardBrand || 'N/A'}
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-white/10"
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3" />

            {/* Info */}
            <div className="space-y-2">
              {/* Localização */}
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 text-rose-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] text-gray-400 mb-0.5">Localização</div>
                  <div className="text-[11px]">
                    <span className="text-white">{transaction.city || 'N/A'}</span>
                    {transaction.country && (
                      <>
                        <span className="text-gray-500 mx-1">•</span>
                        <span className="text-gray-300">{transaction.country}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Coordenadas */}
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] text-gray-400 mb-0.5">Coordenadas</div>
                  <div className="text-[11px] font-mono">
                    <span className="text-blue-300">{transaction.lat.toFixed(4)}</span>
                    <span className="text-gray-500 mx-1">•</span>
                    <span className="text-blue-300">{transaction.lng.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              {/* Valor */}
              {transaction.amount !== undefined && (
                <div className="flex items-start gap-2">
                  <svg className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] text-gray-400 mb-0.5">Valor</div>
                    <div className="text-[11px] font-semibold text-emerald-300">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                    </div>
                  </div>
                </div>
              )}

              {/* Categoria */}
              {transaction.merchantCategory && (
                <div className="flex items-start gap-2">
                  <svg className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] text-gray-400 mb-0.5">Categoria</div>
                    <div className="text-[11px] text-purple-300">
                      {transaction.merchantCategory}
                    </div>
                  </div>
                </div>
              )}

              {/* IP */}
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] text-gray-400 mb-0.5">Endereço IP</div>
                  <div className="text-[11px] font-mono text-cyan-300 truncate">
                    {transaction.ipAddress || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Status */}
              {transaction.decision && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider">Status</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      transaction.isFraud 
                        ? 'bg-red-500/20 text-red-400'
                        : transaction.decision === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : transaction.decision === 'REVIEW'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {transaction.isFraud ? 'FRAUDE' : transaction.decision}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   GLOBE                                    */
/* -------------------------------------------------------------------------- */

const RotatingGlobe = ({
  paused,
  children
}: {
  paused: boolean
  children: React.ReactNode
}) => {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (ref.current && !paused) {
      ref.current.rotation.y += 0.00065
    }
  })

  return <group ref={ref}>{children}</group>
}

const GlobeView: React.FC<GlobeProps & { newTransactionIds: Set<string> }> = ({ 
  transactions,
  newTransactionIds 
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [pausedManually, setPausedManually] = useState(false)

  const hasSelection = selectedIndex !== null

  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#000000] via-[#111111] to-black">
      {/* Stars layer */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars" />
        <div className="stars stars--medium" />
        <div className="stars stars--big" />
      </div>

      {/* Grid animado de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      {/* Glow spots */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")'
      }} />
      
      <Canvas
        camera={{
          position: isMobile ? [0, 0, 12] : [0, 0, 6],
          fov: isMobile ? 55 : 45
        }}
        className="cursor-pointer"
      >
        <ambientLight intensity={1} />

        <Suspense fallback={null}>
          <RotatingGlobe paused={hasSelection || pausedManually}>
            <EarthBase />
            <CountryLines />

            {transactions.map((tx, i) => (
              <TransactionMarker
                key={i}
                transaction={tx}
                index={i}
                isSelected={selectedIndex === i}
                onSelect={() => setSelectedIndex(i)}
                onClose={() => setSelectedIndex(null)}
                isNew={newTransactionIds.has(`${tx.lat}-${tx.lng}-${i}`)}
              />
            ))}
          </RotatingGlobe>
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={3.5}
          maxDistance={10}
        />
      </Canvas>
      
      <button
        onClick={() => setPausedManually((prev) => !prev)}
        className="absolute bottom-6 right-6 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-black/90"
      >
        {pausedManually ? 'Play' : 'Pause'}
      </button>
    </div>
  )
}

// Componente principal que conecta ao WebSocket
const Globe: React.FC = () => {
  const { globeTransactions, isConnected, error } = useWebSocket()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [newTransactionIds, setNewTransactionIds] = useState<Set<string>>(new Set())
  const prevTransactionCountRef = useRef(0)

  // Detectar novas transações
  useEffect(() => {
    if (globeTransactions.length > prevTransactionCountRef.current) {
      // Novas transações foram adicionadas
      const newCount = globeTransactions.length - prevTransactionCountRef.current
      const newTransactions = globeTransactions.slice(-newCount)
      
      newTransactions.forEach((tx, index) => {
        const globalIndex = globeTransactions.length - newCount + index
        const id = generateId()
        
        // Adicionar notificação
        setNotifications(prev => [{
          id,
          transaction: tx,
          timestamp: new Date()
        }, ...prev].slice(0, 20)) // Manter apenas as últimas 20
        
        // Marcar como novo
        const markerId = `${tx.lat}-${tx.lng}-${globalIndex}`
        setNewTransactionIds(prev => new Set(prev).add(markerId))
        
        // Remover marcação de "novo" após 3 segundos
        setTimeout(() => {
          setNewTransactionIds(prev => {
            const next = new Set(prev)
            next.delete(markerId)
            return next
          })
        }, 3000)
        
        // Tocar som
        if (soundEnabled) {
          try {
            playNotificationSound(tx.isFraud || false)
          } catch (e) {
            console.log('Audio not available')
          }
        }
      })
    }
    
    prevTransactionCountRef.current = globeTransactions.length
  }, [globeTransactions, soundEnabled])

  const handleRemoveNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const handleClearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <>
      {/* Status do WebSocket */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
        <span className="text-xs text-white font-medium">
          {isConnected ? 'Conectado' : 'Desconectado'}
        </span>
      </div>

      {/* Contador de transações e controle de som */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-3">
        <div className="px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
          <span className="text-xs text-white font-medium">
            Transações: {globeTransactions.length}
          </span>
        </div>
        
        {/* Botão de som */}
        <button
          onClick={() => setSoundEnabled(prev => !prev)}
          className={`
            p-2 rounded-full backdrop-blur-md border transition-all
            ${soundEnabled 
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
              : 'bg-black/70 border-white/10 text-gray-400'
            }
          `}
          title={soundEnabled ? 'Desativar som' : 'Ativar som'}
        >
          {soundEnabled ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>

        {/* Botão limpar notificações */}
        {notifications.length > 0 && (
          <button
            onClick={handleClearAllNotifications}
            className="px-3 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs text-gray-400 hover:text-white transition-colors"
          >
            Limpar ({notifications.length})
          </button>
        )}
      </div>

      {error && (
        <div className="fixed top-16 right-4 z-50 px-4 py-2 rounded-lg bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-400 text-sm max-w-md">
          {error}
        </div>
      )}

      {/* Notificações */}
      <TransactionNotification
        notifications={notifications}
        onRemove={handleRemoveNotification}
        maxVisible={5}
      />

      <GlobeView 
        transactions={globeTransactions} 
        newTransactionIds={newTransactionIds}
      />
    </>
  )
}

export default Globe