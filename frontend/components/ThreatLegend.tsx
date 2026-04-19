'use client'

import { useState } from 'react'
import { OceanRegion } from '@/lib/supabase'

const THREAT_COLORS: Record<string, string> = {
  coral_bleaching: '#ff6b35',
  dead_zone:       '#8b00ff',
  pollution:       '#ff4444',
  ice_melt:        '#00aaff',
  overfishing:     '#ffaa00',
  acidification:   '#ff00aa',
}

const THREAT_LABELS: Record<string, string> = {
  coral_bleaching: 'CORAL BLEACHING',
  dead_zone:       'OXYGEN DEPLETION',
  pollution:       'CHEMICAL POLLUTION',
  ice_melt:        'ICE SHEET COLLAPSE',
  overfishing:     'ECOSYSTEM COLLAPSE',
  acidification:   'OCEAN ACIDIFICATION',
}

type Props = {
  regions: OceanRegion[]
}

export default function ThreatLegend({ regions }: Props) {
  const [collapsed, setCollapsed] = useState(false)

  // Count regions per threat type
  const threatCounts = regions.reduce((acc, r) => {
    acc[r.primary_threat] = (acc[r.primary_threat] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Average health score
  const avgHealth = regions.length
    ? Math.round(regions.reduce((sum, r) => sum + r.health_score, 0) / regions.length)
    : 0

  const healthColor = avgHealth < 30 ? '#ff4444' : avgHealth < 50 ? '#ffaa00' : '#00d4ff'

  return (
    <div
      className="absolute bottom-8 left-6 z-[1000]"
      style={{ width: collapsed ? 'auto' : 220 }}
    >
      <div
        className="hud-border"
        style={{ background: 'rgba(2, 11, 20, 0.92)' }}
      >
        {/* Header */}
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className="w-full flex items-center justify-between px-3 py-2 text-left"
          style={{ fontFamily: 'var(--font-hud)' }}
        >
          <span className="text-xs tracking-widest text-[var(--hud-primary)] opacity-70">
            THREAT LEGEND
          </span>
          <span className="text-xs text-[var(--hud-primary)] opacity-50">
            {collapsed ? '▶' : '▼'}
          </span>
        </button>

        {!collapsed && (
          <>
            {/* Global health score */}
            <div
              className="px-3 py-2 border-t border-[var(--hud-border)]"
            >
              <p className="text-xs opacity-50 tracking-widest mb-1 text-[var(--hud-primary)]">
                GLOBAL OCEAN HEALTH
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="text-xl font-bold"
                  style={{ color: healthColor, fontFamily: 'var(--font-hud)' }}
                >
                  {avgHealth}
                </span>
                <span className="text-xs opacity-40 text-[var(--hud-primary)]">/100</span>
                <div className="flex-1 h-1 bg-[rgba(255,255,255,0.05)] ml-1">
                  <div
                    className="h-full transition-all duration-1000"
                    style={{
                      width: `${avgHealth}%`,
                      background: healthColor,
                      boxShadow: `0 0 6px ${healthColor}`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Threat types */}
            <div className="px-3 py-2 border-t border-[var(--hud-border)] space-y-2">
              {Object.entries(THREAT_LABELS).map(([key, label]) => {
                const count = threatCounts[key] ?? 0
                const color = THREAT_COLORS[key]
                return (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          background: color,
                          boxShadow: `0 0 4px ${color}`,
                        }}
                      />
                      <span
                        className="text-xs"
                        style={{
                          color,
                          fontFamily: 'var(--font-hud)',
                          fontSize: 9,
                          letterSpacing: '0.1em',
                        }}
                      >
                        {label}
                      </span>
                    </div>
                    <span
                      className="text-xs shrink-0"
                      style={{
                        color,
                        fontFamily: 'var(--font-hud)',
                        opacity: 0.7,
                        fontSize: 10,
                      }}
                    >
                      {count} {count === 1 ? 'REGION' : 'REGIONS'}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Total */}
            <div
              className="px-3 py-2 border-t border-[var(--hud-border)] flex justify-between"
            >
              <span className="text-xs tracking-widest opacity-40 text-[var(--hud-primary)]">
                TOTAL MONITORED
              </span>
              <span className="text-xs text-[var(--hud-primary)] opacity-70">
                {regions.length} REGIONS
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}