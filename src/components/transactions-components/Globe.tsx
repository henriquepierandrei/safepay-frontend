'use client'

import React, { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

import countriesGeoJson from '../../data/countries.geo.json'

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type Transaction = {
  lat: number
  lng: number
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
const CONTINENT_RADIUS = 2.505
const TRANSACTION_RADIUS = 2.52

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

/**
 * Converts latitude/longitude into a Vector3 on a sphere.
 */
const geoToVector3 = (
  lat: number,
  lng: number,
  radius: number = EARTH_RADIUS
): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

/* -------------------------------------------------------------------------- */
/*                                   LAYERS                                   */
/* -------------------------------------------------------------------------- */

const EarthBase: React.FC = () => (
  <group>
    {/* Solid sphere */}
    <mesh>
      <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
      <meshBasicMaterial color="#000000" />
    </mesh>

    {/* Wireframe grid - mais escuro */}
    <mesh>
      <sphereGeometry args={[EARTH_RADIUS + 0.01, 32, 32]} />
      <meshBasicMaterial
        wireframe
        color="#0f172a"
        transparent
        opacity={0.15}
      />
    </mesh>
  </group>
)

/* -------------------------------------------------------------------------- */
/*                            CONTINENT POINTS                                */
/* -------------------------------------------------------------------------- */

type ContinentPointProps = {
  position: THREE.Vector3
  lat: number
  lng: number
  country: string
  onHoverChange: (hovering: boolean) => void
}

const ContinentPoint: React.FC<ContinentPointProps> = ({
  position,
  lat,
  lng,
  country,
  onHoverChange
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const baseScale = hovered ? 1.5 : 1
    const pulse = hovered ? Math.sin(clock.elapsedTime * 5) * 0.2 : 0

    meshRef.current.scale.setScalar(baseScale + pulse)
  })

  const handlePointerOver = (e: any) => {
    e.stopPropagation()
    setHovered(true)
    onHoverChange(true)
  }

  const handlePointerOut = () => {
    setHovered(false)
    onHoverChange(false)
  }

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={hovered ? 1 : 0.5}
        />
      </mesh>

      {hovered && (
        <Html 
          position={position} 
          center 
          distanceFactor={8}
          style={{
            transition: 'all 0.2s ease-out',
            pointerEvents: 'none'
          }}
        >
          <div className="pointer-events-none select-none rounded border border-white/20 bg-black/90 px-3 py-2 backdrop-blur-sm">
            <div className="space-y-1 font-mono text-[10px] text-white">
              <div className="mb-1 border-b border-white/10 pb-1 uppercase tracking-tight text-gray-400">
                {country}
              </div>
              <div>LAT: {lat.toFixed(4)}</div>
              <div>LNG: {lng.toFixed(4)}</div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

const ContinentPoints: React.FC<{ onHoverChange: (hovering: boolean) => void }> = ({ onHoverChange }) => {
  const points = useMemo(() => {
    const result: Omit<ContinentPointProps, 'onHoverChange'>[] = []

    countriesGeoJson.features.forEach((feature: any) => {
      const { coordinates, type } = feature.geometry
      const country =
        feature.properties?.name ||
        feature.properties?.ADMIN ||
        'Unknown'

      const processPolygon = (polygon: any[]) => {
        const STEP = 3

        polygon[0].forEach((coord: number[], index: number) => {
          if (index % STEP !== 0) return

          const [lng, lat] = coord
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return

          result.push({
            position: geoToVector3(lat, lng, CONTINENT_RADIUS),
            lat,
            lng,
            country
          })
        })
      }

      if (type === 'Polygon') processPolygon(coordinates)
      if (type === 'MultiPolygon')
        coordinates.forEach((poly: any) => processPolygon(poly))
    })

    return result
  }, [])

  return (
    <group>
      {points.map((point, index) => (
        <ContinentPoint key={index} {...point} onHoverChange={onHoverChange} />
      ))}
    </group>
  )
}

/* -------------------------------------------------------------------------- */
/*                           TRANSACTION MARKERS                              */
/* -------------------------------------------------------------------------- */

const TransactionMarker: React.FC<{
  transaction: Transaction
  index: number
  onHoverChange: (hovering: boolean) => void
}> = ({ transaction, index, onHoverChange }) => {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  const position = useMemo(
    () => geoToVector3(transaction.lat, transaction.lng, TRANSACTION_RADIUS),
    [transaction.lat, transaction.lng]
  )

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    // Remove balanceamento quando hover
    if (!hovered) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 2 + index) * 0.15
    }

    const targetScale = hovered ? 1.4 : 1
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    )
  })

  const handlePointerOver = (e: any) => {
    e.stopPropagation()
    setHovered(true)
    onHoverChange(true)
  }

  const handlePointerOut = () => {
    setHovered(false)
    onHoverChange(false)
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#f43f5e" />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.07, 0.09, 32]} />
        <meshBasicMaterial
          color="#f43f5e"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {hovered && (
        <Html 
          position={position} 
          center 
          distanceFactor={10}
          occlude
          style={{
            transition: 'all 0.2s ease-out',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="pointer-events-none select-none rounded-lg border border-rose-500/40 bg-gradient-to-br from-slate-900/98 to-slate-800/98 px-3 py-2 shadow-2xl backdrop-blur-md">
            <div className="min-w-[160px] max-w-[180px] space-y-1.5">
              <div className="flex items-center gap-1.5 border-b border-slate-700/60 pb-1.5">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500"></div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-rose-400">
                  Transação
                </span>
              </div>

              {transaction.city && (
                <div className="flex items-start gap-2">
                  <span className="min-w-[45px] text-[9px] font-medium text-slate-400">
                    Cidade:
                  </span>
                  <span className="text-[10px] font-semibold text-white leading-tight">
                    {transaction.city}
                  </span>
                </div>
              )}

              {transaction.country && (
                <div className="flex items-start gap-2">
                  <span className="min-w-[45px] text-[9px] font-medium text-slate-400">
                    País:
                  </span>
                  <span className="text-[10px] font-semibold text-white leading-tight">
                    {transaction.country}
                  </span>
                </div>
              )}

              <div className="flex items-start gap-2">
                <span className="min-w-[45px] text-[9px] font-medium text-slate-400">
                  Lat:
                </span>
                <span className="font-mono text-[10px] font-semibold text-emerald-400">
                  {transaction.lat.toFixed(4)}°
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="min-w-[45px] text-[9px] font-medium text-slate-400">
                  Lng:
                </span>
                <span className="font-mono text-[10px] font-semibold text-emerald-400">
                  {transaction.lng.toFixed(4)}°
                </span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

/* -------------------------------------------------------------------------- */
/*                                GLOBE CORE                                  */
/* -------------------------------------------------------------------------- */

const RotatingGlobe: React.FC<React.PropsWithChildren<{ paused: boolean }>> = ({ 
  children, 
  paused 
}) => {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (ref.current && !paused) {
      ref.current.rotation.y += 0.001
    }
  })

  return <group ref={ref}>{children}</group>
}

const Globe: React.FC<GlobeProps> = ({ transactions }) => {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div className="h-screen w-full overflow-hidden bg-black">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#000']} />
        <ambientLight intensity={1} />

        <Suspense fallback={null}>
          <RotatingGlobe paused={isHovering}>
            <EarthBase />
            <ContinentPoints onHoverChange={setIsHovering} />

            {transactions.map((tx, index) => (
              <TransactionMarker
                key={index}
                transaction={tx}
                index={index}
                onHoverChange={setIsHovering}
              />
            ))}
          </RotatingGlobe>
        </Suspense>

        <OrbitControls
          enableZoom
          enablePan={false}
          minDistance={3.5}
          maxDistance={12}
          autoRotate={false}
        />
      </Canvas>
    </div>
  )
}

export default Globe