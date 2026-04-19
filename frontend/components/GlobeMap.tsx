'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { OceanRegion } from '@/lib/supabase'
import ZoomControls from './ZoomControls'

const THREAT_COLORS: Record<string, string> = {
  coral_bleaching: '#ff6b35',
  dead_zone:       '#8b00ff',
  pollution:       '#ff4444',
  ice_melt:        '#00aaff',
  overfishing:     '#ffaa00',
  acidification:   '#ff00aa',
}

function FlyToRegion({ region }: { region: OceanRegion | null }) {
  const map = useMap()
  useEffect(() => {
    if (region) {
      map.flyTo([region.latitude, region.longitude], 5, { duration: 2 })
    }
  }, [region, map])
  return null
}

type SubmarineProps = {
  fromLatLng: [number, number]
  toLatLng: [number, number]
  onArrived: () => void
}

function SubmarineOverlay({ fromLatLng, toLatLng, onArrived }: SubmarineProps) {
  const map = useMap()
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [angle, setAngle] = useState(0)
  const [visible, setVisible] = useState(false)
  const [trail, setTrail] = useState<{ x: number; y: number; opacity: number }[]>([])
  const frameRef = useRef<number | undefined>(undefined)
  const startRef = useRef<number | undefined>(undefined)
  const duration = 2000

  useEffect(() => {
    const fromPx = map.latLngToContainerPoint(fromLatLng)
    const toPx   = map.latLngToContainerPoint(toLatLng)
    const dx = toPx.x - fromPx.x
    const dy = toPx.y - fromPx.y
    const deg = Math.atan2(dy, dx) * (180 / Math.PI)
    setAngle(deg)
    setVisible(true)

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const ease = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress

      const currentFrom = map.latLngToContainerPoint(fromLatLng)
      const currentTo   = map.latLngToContainerPoint(toLatLng)
      const x = currentFrom.x + (currentTo.x - currentFrom.x) * ease
      const y = currentFrom.y + (currentTo.y - currentFrom.y) * ease

      setPos({ x, y })
      setTrail(prev => [
        { x, y, opacity: 0.6 },
        ...prev.slice(0, 6).map(p => ({ ...p, opacity: p.opacity * 0.6 }))
      ])

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setVisible(false)
        setTrail([])
        onArrived()
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [])

  if (!visible) return null

  return (
    <>
      {/* Bubble trail */}
      {trail.map((t, i) => (
        <div
          key={i}
          className="absolute pointer-events-none z-[499] rounded-full"
          style={{
            left: t.x,
            top: t.y,
            width: Math.max(4 - i * 0.4, 1),
            height: Math.max(4 - i * 0.4, 1),
            background: '#00d4ff',
            opacity: t.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

     {/* Submarine image */}
<div
  className="absolute pointer-events-none z-[500]"
  style={{
    left: pos.x,
    top: pos.y,
    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
    filter: 'drop-shadow(0 0 6px #00d4ff) drop-shadow(0 0 12px #00aaff) brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(170deg)',
  }}
>
  <img
    src="/submarine.png"
    alt="submarine"
    style={{ width: 64, height: 'auto' }}
  />
</div>
    </>
  )
}

type Props = {
  regions: OceanRegion[]
  onRegionSelect: (region: OceanRegion) => void
  selected: OceanRegion | null
  isDark: boolean
}

export default function GlobeMap({ regions, onRegionSelect, selected, isDark }: Props) {
  const [submarine, setSubmarine] = useState<{
    from: [number, number]
    to: [number, number]
    region: OceanRegion
  } | null>(null)

  const [mapCenter] = useState<[number, number]>([20, 0])

  const handleClick = (region: OceanRegion, e: any) => {
    const map = e.target._map
    const center = map.getCenter()
    setSubmarine({
      from: [center.lat, center.lng],
      to: [region.latitude, region.longitude],
      region,
    })
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={2}
      minZoom={2}
      maxZoom={8}
      className="w-full h-full"
      zoomControl={false}
      style={{ background: '#020b14' }}
    >
      <TileLayer
        url={isDark
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        }
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      <FlyToRegion region={selected} />

      {regions.map(region => {
        const color = THREAT_COLORS[region.primary_threat] ?? '#00d4ff'
        return (
          <CircleMarker
            key={region.slug}
            center={[region.latitude, region.longitude]}
            radius={10}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.8,
              weight: 2,
            }}
            eventHandlers={{
              click: (e) => handleClick(region, e),
            }}
          >
            <Tooltip
              permanent
              direction="top"
              offset={[0, -14]}
              className="hud-tooltip"
            >
              {region.name}
            </Tooltip>
          </CircleMarker>
        )
      })}

      {submarine && (
        <SubmarineOverlay
          fromLatLng={submarine.from}
          toLatLng={submarine.to}
          onArrived={() => {
            onRegionSelect(submarine.region)
            setSubmarine(null)
          }}
        />
      )}
      <ZoomControls />
    </MapContainer>
  )
}