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
import ThreatLegend from '@/components/ThreatLegend'
import ReportForm from '@/components/ReportForm'
import HudStats from '@/components/HudStats'
import RecentReports from '@/components/RecentReports'
import MobileMenu from '@/components/MobileMenu'
import { useRouter } from 'next/navigation'

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
  const [regions, setRegions]         = useState<OceanRegion[]>([])
  const [selected, setSelected]       = useState<OceanRegion | null>(null)
  const [appState, setAppState]       = useState<AppState>('map')
  const [monologue, setMonologue]     = useState('')
  const [showPing, setShowPing]       = useState(false)
  const [pingColor, setPingColor]     = useState('#00d4ff')
  const [isDark, setIsDark]           = useState(true)
  const [loading, setLoading]         = useState(true)
  const [showReport, setShowReport]   = useState(false)
  const [showReports, setShowReports] = useState(false)
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
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 hud-border border-t-0 border-l-0 border-r-0">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: 'rgba(0,212,255,0.15)', animationDuration: '2s' }}
            />
            <div
              className="relative w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                border: '1px solid rgba(0,212,255,0.6)',
                background: 'rgba(0,212,255,0.08)',
                boxShadow: '0 0 12px rgba(0,212,255,0.3)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#00d4ff" strokeWidth="0.5" strokeOpacity="0.4"/>
                <circle cx="8" cy="8" r="4.5" stroke="#00d4ff" strokeWidth="0.5" strokeOpacity="0.6"/>
                <circle cx="8" cy="8" r="2" stroke="#00d4ff" strokeWidth="0.5" strokeOpacity="0.8"/>
                <circle cx="8" cy="8" r="1" fill="#00d4ff"/>
                <line x1="8" y1="8" x2="15" y2="8" stroke="#00d4ff" strokeWidth="0.8" strokeOpacity="0.8"/>
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span
              className="font-bold leading-none"
              style={{
                color: '#00d4ff',
                fontFamily: 'var(--font-hud)',
                fontSize: 15,
                letterSpacing: '0.25em',
                textShadow: '0 0 20px rgba(0,212,255,0.5)',
              }}
            >
              ABYSSAL
            </span>
            <span
              className="leading-none"
              style={{
                color: '#00d4ff',
                fontFamily: 'var(--font-hud)',
                fontSize: 9,
                letterSpacing: '0.5em',
                opacity: 0.7,
              }}
            >
              SCOPE
            </span>
          </div>
        </div>

        {/* Center stats — hidden on mobile */}
        <div className="hidden md:block">
          <HudStats regions={regions} />
        </div>

        {/* Desktop controls */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(prev => !prev)} />
          <button
            onClick={() => router.push('/about')}
            className="text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity text-[var(--hud-primary)]"
            style={{ border: '1px solid var(--hud-border)', padding: '4px 10px', fontFamily: 'var(--font-hud)' }}
          >
            ABOUT
          </button>
          <button
            onClick={() => setShowReport(true)}
            className="text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity text-[var(--hud-primary)]"
            style={{ border: '1px solid var(--hud-border)', padding: '4px 10px', fontFamily: 'var(--font-hud)' }}
          >
            + REPORT
          </button>
          <button
            onClick={() => setShowReports(true)}
            className="text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity text-[var(--hud-primary)]"
            style={{ border: '1px solid var(--hud-border)', padding: '4px 10px', fontFamily: 'var(--font-hud)' }}
          >
            FIELD REPORTS
          </button>
          <SignalStrength />
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <SignalStrength />
          <MobileMenu
            onReport={() => setShowReport(true)}
            onFieldReports={() => setShowReports(true)}
            isDark={isDark}
            onToggleTheme={() => setIsDark(prev => !prev)}
          />
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

      {/* Threat legend */}
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

      {/* Report form */}
      {showReport && (
        <ReportForm onClose={() => setShowReport(false)} />
      )}

      {/* Recent reports */}
      {showReports && (
        <RecentReports onClose={() => setShowReports(false)} />
      )}

    </main>
  )
}