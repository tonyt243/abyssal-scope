'use client'

import { useRouter } from 'next/navigation'

export default function AboutPage() {
  const router = useRouter()

  return (
    <main className="w-screen min-h-screen bg-[#020b14] overflow-y-auto">

      {/* Top HUD bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 hud-border border-t-0 border-l-0 border-r-0 bg-[#020b14]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[var(--hud-primary)] animate-pulse" />
          <span className="text-[var(--hud-primary)] text-sm tracking-[0.3em] font-bold">
            ABYSSAL SCOPE
          </span>
        </div>
        <span className="text-[var(--hud-primary)] text-xs tracking-widest opacity-60">
          OCEAN THREAT MONITORING SYSTEM v1.0
        </span>
        <button
          onClick={() => router.push('/')}
          className="text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity text-[var(--hud-primary)]"
          style={{ border: '1px solid var(--hud-border)', padding: '4px 12px', fontFamily: 'var(--font-hud)' }}
        >
          ← BACK TO MAP
        </button>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-8 py-16">

        {/* Hero */}
        <div className="mb-16 hud-corner" style={{ padding: '2px' }}>
          <div className="border border-[var(--hud-border)] p-8" style={{ boxShadow: '0 0 40px rgba(0,212,255,0.05)' }}>
            <p className="text-xs tracking-[0.4em] opacity-50 mb-3 text-[var(--hud-primary)]">
              MISSION BRIEFING
            </p>
            <h1 className="text-3xl tracking-widest text-[var(--hud-primary)] mb-4 font-bold">
              WHAT IS ABYSSAL SCOPE?
            </h1>
            <p className="text-sm leading-relaxed opacity-80 text-[var(--hud-primary)]">
              AbyssalScope is an AI-powered ocean threat monitoring system that gives the world's most endangered ocean regions a voice. Select any region on the map, and the ocean itself will tell you what is happening to it — in real time, grounded in verified scientific data.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.4em] opacity-50 mb-6 text-[var(--hud-primary)]">
            HOW IT WORKS
          </p>
          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'SELECT A REGION',
                desc: 'Click any threat marker on the map. A submarine navigates to your selected region as the system establishes contact.',
                color: '#00d4ff',
              },
              {
                step: '02',
                title: 'THE OCEAN SPEAKS',
                desc: 'Claude AI generates a first-person distress transmission from that body of water — grounded in real NOAA, AIMS, NSIDC and WWF data stored in our database.',
                color: '#ffaa00',
              },
              {
                step: '03',
                title: 'START A DIALOGUE',
                desc: 'After the monologue, you can talk back. Ask questions, challenge the ocean, or find out what you can do. Ocean stays in character and responds with facts.',
                color: '#ff6b35',
              },
              {
                step: '04',
                title: 'REAL DATA, REAL STAKES',
                desc: 'Every statistic the ocean cites is sourced from peer-reviewed studies and government agencies. The AI gives the data a voice — it does not invent the facts.',
                color: '#00ff88',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-6 p-6 border border-[var(--hud-border)] animate-fade-in"
                style={{ background: 'rgba(0,212,255,0.02)' }}
              >
                <div
                  className="text-2xl font-bold shrink-0"
                  style={{ color: item.color, fontFamily: 'var(--font-hud)', opacity: 0.6 }}
                >
                  {item.step}
                </div>
                <div>
                  <p className="text-xs tracking-widest mb-2" style={{ color: item.color }}>
                    {item.title}
                  </p>
                  <p className="text-sm leading-relaxed opacity-70 text-[var(--hud-primary)]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Threat legend */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.4em] opacity-50 mb-6 text-[var(--hud-primary)]">
            THREAT CLASSIFICATION
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'CORAL BLEACHING', color: '#ff6b35' },
              { label: 'OXYGEN DEPLETION', color: '#8b00ff' },
              { label: 'CHEMICAL POLLUTION', color: '#ff4444' },
              { label: 'ICE SHEET COLLAPSE', color: '#00aaff' },
              { label: 'ECOSYSTEM COLLAPSE', color: '#ffaa00' },
              { label: 'OCEAN ACIDIFICATION', color: '#ff00aa' },
            ].map((threat) => (
              <div
                key={threat.label}
                className="flex items-center gap-3 p-3 border border-[var(--hud-border)]"
                style={{ background: `${threat.color}08` }}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: threat.color, boxShadow: `0 0 6px ${threat.color}` }}
                />
                <span className="text-xs tracking-widest" style={{ color: threat.color }}>
                  {threat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data sources */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.4em] opacity-50 mb-6 text-[var(--hud-primary)]">
            DATA SOURCES
          </p>
          <div className="border border-[var(--hud-border)] p-6" style={{ background: 'rgba(0,212,255,0.02)' }}>
            <p className="text-sm leading-relaxed opacity-70 text-[var(--hud-primary)] mb-4">
              All ocean health data is sourced from verified scientific institutions and peer-reviewed research. AbyssalScope does not generate statistics — it grounds AI responses in real measurements.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'NOAA Coral Reef Watch',
                'Australian Institute of Marine Science (AIMS)',
                'National Snow and Ice Data Center (NSIDC)',
                'NASA Earthdata',
                'WWF Living Planet Report',
                'Mekong River Commission',
                'IUCN Red List',
                'Conservation International',
                'Oceana UK',
                'UN Environment Programme',
              ].map((source) => (
                <div key={source} className="flex items-center gap-2">
                  <span className="text-[var(--hud-primary)] opacity-40">—</span>
                  <span className="text-xs opacity-60 text-[var(--hud-primary)]">{source}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-8">
          <button
            onClick={() => router.push('/')}
            className="px-12 py-4 text-sm tracking-[0.4em] transition-all"
            style={{
              border: '1px solid #00d4ff',
              color: '#00d4ff',
              background: 'rgba(0,212,255,0.05)',
              fontFamily: 'var(--font-hud)',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0,212,255,0.1)',
            }}
          >
            ▶ ENTER THE DEEP
          </button>
        </div>

      </div>
    </main>
  )
}