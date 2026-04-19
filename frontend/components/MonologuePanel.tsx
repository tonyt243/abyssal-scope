'use client'

import { useEffect, useState, useRef } from 'react'
import { OceanRegion } from '@/lib/supabase'

type Props = {
  region: OceanRegion
  onComplete: () => void
  onBack: () => void
}

const THREAT_LABELS: Record<string, string> = {
  coral_bleaching: 'CORAL BLEACHING',
  dead_zone:       'OXYGEN DEPLETION',
  pollution:       'CHEMICAL POLLUTION',
  ice_melt:        'ICE SHEET COLLAPSE',
  overfishing:     'ECOSYSTEM COLLAPSE',
  acidification:   'OCEAN ACIDIFICATION',
}

const THREAT_COLORS: Record<string, string> = {
  coral_bleaching: '#ff6b35',
  dead_zone:       '#8b00ff',
  pollution:       '#ff4444',
  ice_melt:        '#00aaff',
  overfishing:     '#ffaa00',
  acidification:   '#ff00aa',
}

export default function MonologuePanel({ region, onComplete, onBack }: Props) {
  const [monologue, setMonologue] = useState('')
  const [streaming, setStreaming] = useState(true)
  const [displayText, setDisplayText] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const monologueRef = useRef('')

  const threatColor = THREAT_COLORS[region.primary_threat] ?? '#00d4ff'

  // Fetch monologue stream from FastAPI
  useEffect(() => {
    const fetchMonologue = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/monologue`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            region_name:         region.name,
            slug:                region.slug,
            health_score:        region.health_score,
            primary_threat:      region.primary_threat,
            threat_description:  region.threat_description,
            temperature_anomaly: region.temperature_anomaly,
          }),
        })

        const reader = res.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) return

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          monologueRef.current += chunk
          setMonologue(prev => prev + chunk)
        }

        setStreaming(false)
      } catch (err) {
        console.error('Monologue fetch failed:', err)
        setStreaming(false)
      }
    }

    fetchMonologue()
  }, [region])

  // Typewriter effect
  useEffect(() => {
    if (charIndex < monologue.length) {
      const timeout = setTimeout(() => {
        setDisplayText(monologue.slice(0, charIndex + 1))
        setCharIndex(prev => prev + 1)
      }, 18)
      return () => clearTimeout(timeout)
    }
    if (!streaming && charIndex >= monologue.length && monologue.length > 0) {
    }
  }, [charIndex, monologue, streaming])

  const healthColor =
    region.health_score < 30 ? '#ff4444' :
    region.health_score < 50 ? '#ffaa00' : '#00d4ff'

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
      <div
        className="hud-border hud-corner bg-[var(--hud-surface)] w-full max-w-2xl mx-4 p-8"
        style={{ borderColor: `${threatColor}44` }}
      >

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs tracking-[0.4em] opacity-50 mb-1"
               style={{ color: threatColor }}>
              TRANSMISSION RECEIVED
            </p>
            <h2 className="text-2xl tracking-widest"
                style={{ color: threatColor }}>
              {region.name.toUpperCase()}
            </h2>
          </div>
          <button
            onClick={onBack}
            className="text-xs tracking-widest opacity-40 hover:opacity-80 transition-opacity text-[var(--hud-primary)]"
          >
            ✕ DISCONNECT
          </button>
        </div>

        {/* Stats row */}
        <div className="flex gap-6 mb-6 pb-4 border-b border-[var(--hud-border)]">
          <div>
            <p className="text-xs opacity-50 tracking-widest mb-1">HEALTH INDEX</p>
            <p className="text-xl font-bold" style={{ color: healthColor }}>
              {region.health_score}<span className="text-xs opacity-50">/100</span>
            </p>
          </div>
          <div>
            <p className="text-xs opacity-50 tracking-widest mb-1">THREAT CLASS</p>
            <p className="text-sm" style={{ color: threatColor }}>
              {THREAT_LABELS[region.primary_threat] ?? region.primary_threat.toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-xs opacity-50 tracking-widest mb-1">TEMP ANOMALY</p>
            <p className="text-sm text-[#ff4444]">
              +{region.temperature_anomaly}°C
            </p>
          </div>
          <div>
            <p className="text-xs opacity-50 tracking-widest mb-1">DATA SOURCE</p>
            <p className="text-xs opacity-70" style={{ color: threatColor }}>
                {region.source ?? 'NOAA / AIMS / NSIDC'}
            </p>
            </div>
        </div>

        {/* Monologue */}
        <div className="min-h-[140px] mb-6">
          {monologue.length === 0 ? (
            <p className="text-xs tracking-widest opacity-40 animate-pulse">
              ESTABLISHING DEEP CHANNEL...
            </p>
          ) : (
            <p className="text-sm leading-relaxed opacity-90 text-[var(--hud-primary)]">
              {displayText}
              {streaming && (
                <span className="inline-block w-2 h-4 bg-[var(--hud-primary)] ml-1 animate-pulse" />
              )}
            </p>
          )}
        </div>

        {/* Footer */}
        {!streaming && charIndex >= monologue.length && (
            <div className="border-t border-[var(--hud-border)] pt-4 flex items-center justify-between">
                    <p className="text-xs tracking-[0.3em] opacity-50 animate-pulse">
                        THE OCEAN IS LISTENING...
                    </p>
                    <button
                        onClick={onComplete}
                        className="text-xs tracking-widest text-[var(--hud-primary)] opacity-60 hover:opacity-100 transition-opacity border border-[var(--hud-border)] px-3 py-1"
                    >
                        RESPOND →
                    </button>
                </div>
            )}

      </div>
    </div>
  )
}