'use client'

import React, { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import './GlobeStyle.css';

import countriesGeoJson from '../../data/countries.geo.json'

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type Transaction = {
  lat: number
  lng: number
  cardBrand?: string
  ipAddress?: string
  country?: string
  city?: string
}

type GlobeProps = {
  transactions: Transaction[]
}

/* -------------------------------------------------------------------------- */
/*                                   CONSTANTS                                */
/* -------------------------------------------------------------------------- */

const EARTH_RADIUS = 2.5
const COUNTRY_RADIUS = 2.505
const HOVER_RADIUS = 2.52
const TRANSACTION_RADIUS = 2.55

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
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

const computeCentroid = (coords: number[][]) => {
  let lat = 0
  let lng = 0

  coords.forEach(([cLng, cLat]) => {
    lat += cLat
    lng += cLng
  })

  return {
    lat: lat / coords.length,
    lng: lng / coords.length
  }
}

/* -------------------------------------------------------------------------- */
/*                                   EARTH                                    */
/* -------------------------------------------------------------------------- */

const EarthBase = () => (
  <group>
    {/* Base */}
    <mesh>
      <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
      <meshStandardMaterial color="#020617" roughness={0.9} metalness={0.1} />
    </mesh>

    {/* Grid moderna (lat/lng soft) */}
    <mesh>
      <sphereGeometry args={[EARTH_RADIUS + 0.01, 96, 96]} />
      <meshBasicMaterial
        wireframe
        color="white"
        transparent
        opacity={0.01}
      />
    </mesh>
  </group>
)

/* -------------------------------------------------------------------------- */
/*                              COUNTRY LINES                                 */
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
/*                          COUNTRY HOVER CENTERS                              */
/* -------------------------------------------------------------------------- */




/* -------------------------------------------------------------------------- */
/*                            TRANSACTIONS                                    */
/* -------------------------------------------------------------------------- */

const TransactionMarker = ({
  transaction,
  index,
  isSelected,
  onSelect,
  onClose
}: {
  transaction: Transaction
  index: number
  isSelected: boolean
  onSelect: () => void
  onClose: () => void
}) => {
  const ref = useRef<THREE.Group>(null)

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
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    if (isSelected) {
      onClose()
    } else {
      onSelect()
    }
  }

  return (
    <group
      ref={ref}
      position={position}
      onClick={handleClick}
    >

      <mesh>
        <sphereGeometry args={[0.015, 22, 22]} />
        <meshBasicMaterial color={isSelected ? "#4ade80" : "#307355"} />
      </mesh>



      {isSelected && (
        <Html center distanceFactor={4}>
          <div
            className="rounded-lg border border-white/10  backdrop-blur-sm px-4 py-3 text-white transition-all duration-500 ease-out min-w-[200px]"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-md bg-gradient-to-br from-black to-emerald-950 flex items-center justify-center shadow-lg transition-transform duration-300 ease-out`}>
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[9px] text-gray-400 uppercase tracking-wider">Transação</div>
                  <div className="text-xs font-semibold text-white uppercase">
                    {transaction.cardBrand || 'MASTERCARD'}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="w-6 h-6 rounded-full cursor-pointer hover:scale-120 flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3" />

            {/* Info */}
            <div className="space-y-2">
              {/* Coordenadas */}
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 text-rose-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] text-gray-400 mb-0.5">Coordenadas</div>
                  <div className="text-[11px] font-mono">
                    <span className="text-rose-300">{transaction.lat.toFixed(4)}</span>
                    <span className="text-gray-500 mx-1">•</span>
                    <span className="text-rose-300">{transaction.lng.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              {/* IP */}
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] text-gray-400 mb-0.5">Endereço IP</div>
                  <div className="text-[11px] font-mono text-blue-300 truncate">
                    {transaction.ipAddress || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 GLOBE                                      */
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

const Globe: React.FC<GlobeProps> = ({ transactions }) => {
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
        className="absolute bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-black/90"
      >
        {pausedManually ? 'Play' : 'Pause'}
      </button>


    </div>
  )
}

export default Globe