'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase, OceanRegion } from '@/lib/supabase'
import MonologuePanel from '@/components/MonologuePanel'
import DialoguePanel from '@/components/DialoguePanel'
import SonarPing from '@/components/SonarPing'
import SignalStrength from '@/components/SignalStrength'
import ThemeToggle from '@/components/ThemeToggle'
import LoadingScreen from '@/components/LoadingScreen'
import { useRouter } from 'next/navigation'
import ThreatLegend from '@/components/ThreatLegend'

const GlobeMap = dynamic(() => import('@/components/GlobeMap'), { ssr: false })

const THREAT_COLORS: Record<string, string> = {
  coral_bleaching: '#ff6b35',
  dead_zone:       '#8b00ff',
  pollution:       '#ff4444',
  ice_melt:        '#00aaff',
  overfishing:     '#ffaa00',
  acidification:   '#ff00aa',
}

type AppState = 'map' | 'monologue' | 'dialogue'

export default function Home() {
  const [regions, setRegions]     = useState<OceanRegion[]>([])
  const [selected, setSelected]   = useState<OceanRegion | null>(null)
  const [appState, setAppState]   = useState<AppState>('map')
  const [monologue, setMonologue] = useState('')
  const [showPing, setShowPing]   = useState(false)
  const [pingColor, setPingColor] = useState('#00d4ff')
  const [isDark, setIsDark]       = useState(true)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase
      .from('ocean_regions')
      .select('*')
      .then(({ data }) => { if (data) setRegions(data) })
  }, [])

  const handleRegionSelect = (region: OceanRegion) => {
    setSelected(region)
    setMonologue('')
    setPingColor(THREAT_COLORS[region.primary_threat] ?? '#00d4ff')
    setShowPing(true)
  }

  const handleBack = () => {
    setSelected(null)
    setAppState('map')
    setMonologue('')
  }

  return (
    <main className="w-screen h-screen relative overflow-hidden bg-[#020b14]">

      {/* Loading screen */}
      {loading && (
        <LoadingScreen onComplete={() => setLoading(false)} />
      )}

      {/* Top HUD bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-3 hud-border border-t-0 border-l-0 border-r-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[var(--hud-primary)] animate-pulse" />
          <span className="text-[var(--hud-primary)] text-sm tracking-[0.3em] font-bold">
            ABYSSAL SCOPE
          </span>
        </div>
        <span className="text-[var(--hud-primary)] text-xs tracking-widest opacity-60">
          OCEAN THREAT MONITORING SYSTEM
        </span>
        <div className="flex items-center gap-3">
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(prev => !prev)} />
          <button
            onClick={() => router.push('/about')}
            className="text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity text-[var(--hud-primary)]"
            style={{ border: '1px solid var(--hud-border)', padding: '4px 12px', fontFamily: 'var(--font-hud)' }}
          >
            ABOUT
          </button>
          <SignalStrength />
          <span className="text-[var(--hud-primary)] text-xs opacity-60">
            {regions.length} REGIONS TRACKED
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="absolute inset-0 z-0">
        {regions.length > 0 && (
          <GlobeMap
            regions={regions}
            onRegionSelect={handleRegionSelect}
            selected={selected}
            isDark={isDark}
          />
        )}
      </div>

      {appState === 'map' && (
        <ThreatLegend regions={regions} />
      )}

      {/* Bottom instruction */}
      {appState === 'map' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center">
          <p className="text-[var(--hud-primary)] text-xs tracking-[0.4em] opacity-70 animate-pulse">
            SELECT A REGION TO ESTABLISH CONTACT
          </p>
        </div>
      )}

      {/* Sonar ping */}
      {showPing && (
        <SonarPing
          color={pingColor}
          onDone={() => {
            setShowPing(false)
            setAppState('monologue')
          }}
        />
      )}

      {/* Monologue panel */}
      {appState === 'monologue' && selected && (
        <MonologuePanel
          region={selected}
          onMonologueComplete={setMonologue}
          onComplete={() => setAppState('dialogue')}
          onBack={handleBack}
        />
      )}

      {/* Dialogue panel */}
      {appState === 'dialogue' && selected && (
        <DialoguePanel
          region={selected}
          monologue={monologue}
          onBack={handleBack}
        />
      )}

    </main>
  )
}