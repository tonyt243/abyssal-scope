'use client'

import { useEffect, useState } from 'react'

type Report = {
  id: string
  created_at: string
  title: string
  description: string
  threat_type: string
  location_name: string
  reporter_name: string
}

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
  onClose: () => void
}

export default function RecentReports({ onClose }: Props) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`)
        const data = await res.json()
        setReports(data)
      } catch {
        setReports([])
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase()
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 animate-fade-in">
      <div
        className="hud-border hud-corner bg-[var(--hud-surface)] w-full max-w-2xl mx-4 animate-slide-in flex flex-col"
        style={{ maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--hud-border)]">
          <div>
            <p className="text-xs tracking-[0.4em] opacity-50 mb-1 text-[var(--hud-primary)]">
              COMMUNITY INTELLIGENCE
            </p>
            <h2 className="text-lg tracking-widest text-[var(--hud-primary)]">
              FIELD REPORTS
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs tracking-widest opacity-40 text-[var(--hud-primary)]">
              {reports.length} REPORTS LOGGED
            </span>
            <button
              onClick={onClose}
              className="text-xs tracking-widest opacity-40 hover:opacity-80 transition-opacity text-[var(--hud-primary)]"
            >
              ✕ CLOSE
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-xs tracking-widest opacity-40 animate-pulse text-[var(--hud-primary)]">
                RETRIEVING FIELD REPORTS...
              </p>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <p className="text-xs tracking-widest opacity-40 text-[var(--hud-primary)]">
                NO REPORTS LOGGED YET
              </p>
              <p className="text-xs opacity-30 text-[var(--hud-primary)]">
                Be the first to submit a field observation
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report, i) => {
                const color = THREAT_COLORS[report.threat_type] ?? '#00d4ff'
                return (
                  <div
                    key={report.id}
                    className="p-4 border border-[var(--hud-border)] animate-fade-in"
                    style={{
                      background: `${color}06`,
                      borderColor: `${color}22`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  >
                    {/* Report header */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full shrink-0 mt-[2px]"
                          style={{ background: color, boxShadow: `0 0 4px ${color}` }}
                        />
                        <p
                          className="text-base tracking-wide"
                          style={{ color, fontFamily: 'var(--font-hud)' }}
                        >
                          {report.title}
                        </p>
                      </div>
                      <span
                        className="text-xs shrink-0 opacity-40 text-[var(--hud-primary)]"
                        style={{ fontFamily: 'var(--font-hud)', fontSize: 11 }}
                      >
                        {formatDate(report.created_at)}
                      </span>
                    </div>

                    {/* Threat + location */}
                    <div className="flex items-center gap-3 mb-2 ml-4">
                      <span
                        style={{
                          color,
                          opacity: 0.7,
                          fontFamily: 'var(--font-hud)',
                          fontSize: 11,
                          letterSpacing: '0.1em',
                        }}
                      >
                        {THREAT_LABELS[report.threat_type] ?? report.threat_type.toUpperCase()}
                      </span>
                      <span className="text-[var(--hud-primary)] opacity-20 text-xs">|</span>
                      <span
                        className="opacity-50 text-[var(--hud-primary)]"
                        style={{ fontFamily: 'var(--font-hud)', fontSize: 11 }}
                      >
                        📍 {report.location_name.toUpperCase()}
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className="text-sm leading-relaxed opacity-60 text-[var(--hud-primary)] ml-4"
                      style={{ fontFamily: 'var(--font-hud)' }}
                    >
                      {report.description}
                    </p>

                    {/* Reporter */}
                    <div className="mt-2 ml-4">
                      <span
                        className="opacity-30 text-[var(--hud-primary)]"
                        style={{ fontFamily: 'var(--font-hud)', fontSize: 11 }}
                      >
                        REPORTED BY: {report.reporter_name.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--hud-border)] flex justify-between items-center">
          <p className="text-xs opacity-30 text-[var(--hud-primary)] tracking-widest">
            COMMUNITY OBSERVATIONS HELP TRACK UNREPORTED THREATS
          </p>
          <button
            onClick={onClose}
            className="text-xs tracking-widest px-4 py-1 transition-opacity hover:opacity-100 opacity-60"
            style={{
              border: '1px solid var(--hud-border)',
              color: 'var(--hud-primary)',
              fontFamily: 'var(--font-hud)',
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}