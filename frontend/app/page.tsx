'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase, OceanRegion } from '@/lib/supabase'
import MonologuePanel from '@/components/MonologuePanel'

const GlobeMap = dynamic(() => import('@/components/GlobeMap'), { ssr: false })

type AppState = 'map' | 'monologue' | 'dialogue'

export default function Home() {
  const [regions, setRegions]   = useState<OceanRegion[]>([])
  const [selected, setSelected] = useState<OceanRegion | null>(null)
  const [appState, setAppState] = useState<AppState>('map')

  useEffect(() => {
    supabase
      .from('ocean_regions')
      .select('*')
      .then(({ data }) => { if (data) setRegions(data) })
  }, [])

  const handleRegionSelect = (region: OceanRegion) => {
    setSelected(region)
    setAppState('monologue')
  }

  const handleBack = () => {
    setSelected(null)
    setAppState('map')
  }

  return (
    <main className="w-screen h-screen relative overflow-hidden bg-[#020b14]">

      {/* Top HUD bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-3 hud-border border-t-0 border-l-0 border-r-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[var(--hud-primary)] animate-pulse" />
          <span className="text-[var(--hud-primary)] text-sm tracking-[0.3em] font-bold">
            ABYSSALSCOPE
          </span>
        </div>
        <span className="text-[var(--hud-primary)] text-xs tracking-widest opacity-60">
          OCEAN THREAT MONITORING SYSTEM v1.0
        </span>
        <span className="text-[var(--hud-primary)] text-xs opacity-60">
          {regions.length} REGIONS TRACKED
        </span>
      </div>

      {/* Map */}
      <div className="absolute inset-0 z-0">
        {regions.length > 0 && (
          <GlobeMap
            regions={regions}
            onRegionSelect={handleRegionSelect}
            selected={selected}
          />
        )}
      </div>

      {/* Bottom instruction */}
      {appState === 'map' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center">
          <p className="text-[var(--hud-primary)] text-xs tracking-[0.4em] opacity-70 animate-pulse">
            SELECT A REGION TO ESTABLISH CONTACT
          </p>
        </div>
      )}

      {/* Monologue panel */}
      {appState === 'monologue' && selected && (
        <MonologuePanel
          region={selected}
          onComplete={() => setAppState('dialogue')}
          onBack={handleBack}
        />
      )}

    </main>
  )
}