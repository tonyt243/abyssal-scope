'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { OceanRegion } from '@/lib/supabase'

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

type Props = {
  regions: OceanRegion[]
  onRegionSelect: (region: OceanRegion) => void
  selected: OceanRegion | null
}

export default function GlobeMap({ regions, onRegionSelect, selected }: Props) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={8}
      className="w-full h-full"
      zoomControl={false}
      style={{ background: '#020b14' }}
    >
      {/* Dark ocean tile layer */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
              click: () => onRegionSelect(region),
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
    </MapContainer>
  )
}