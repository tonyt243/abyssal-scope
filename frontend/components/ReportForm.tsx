'use client'

import { useState } from 'react'

const THREAT_OPTIONS = [
  { value: 'coral_bleaching', label: 'CORAL BLEACHING', color: '#ff6b35' },
  { value: 'dead_zone',       label: 'OXYGEN DEPLETION', color: '#8b00ff' },
  { value: 'pollution',       label: 'CHEMICAL POLLUTION', color: '#ff4444' },
  { value: 'ice_melt',        label: 'ICE SHEET COLLAPSE', color: '#00aaff' },
  { value: 'overfishing',     label: 'ECOSYSTEM COLLAPSE', color: '#ffaa00' },
  { value: 'acidification',   label: 'OCEAN ACIDIFICATION', color: '#ff00aa' },
]

type Props = {
  onClose: () => void
}

export default function ReportForm({ onClose }: Props) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    threat_type: 'pollution',
    location_name: '',
    reporter_name: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.location_name) {
      setError('PLEASE FILL ALL REQUIRED FIELDS')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          reporter_name: form.reporter_name || 'Anonymous',
        }),
      })

      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
    } catch {
      setError('SUBMISSION FAILED — TRY AGAIN')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedThreat = THREAT_OPTIONS.find(t => t.value === form.threat_type)
  const threatColor = selectedThreat?.color ?? '#00d4ff'

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 animate-fade-in">
      <div
        className="hud-border hud-corner bg-[var(--hud-surface)] w-full max-w-lg mx-4 p-8 animate-slide-in"
        style={{ borderColor: 'rgba(0,212,255,0.3)' }}
      >

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs tracking-[0.4em] opacity-50 mb-1 text-[var(--hud-primary)]">
              COMMUNITY INTELLIGENCE
            </p>
            <h2 className="text-lg tracking-widest text-[var(--hud-primary)]">
              SUBMIT OCEAN REPORT
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs tracking-widest opacity-40 hover:opacity-80 transition-opacity text-[var(--hud-primary)]"
          >
            ✕ CLOSE
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="text-center py-8">
            <div
              className="text-4xl mb-4"
              style={{ color: '#00ff88' }}
            >
              ✓
            </div>
            <p className="text-sm tracking-widest mb-2" style={{ color: '#00ff88' }}>
              REPORT TRANSMITTED
            </p>
            <p className="text-xs opacity-50 text-[var(--hud-primary)] mb-6">
              Your observation has been logged in the AbyssalScope database.
            </p>
            <button
              onClick={onClose}
              className="text-xs tracking-widest px-6 py-2 transition-opacity hover:opacity-100 opacity-70"
              style={{
                border: '1px solid #00ff88',
                color: '#00ff88',
                fontFamily: 'var(--font-hud)',
              }}
            >
              RETURN TO MAP
            </button>
          </div>
        ) : (
          /* Form */
          <div className="space-y-4">

            {/* Title */}
            <div>
              <p className="text-xs tracking-widest opacity-50 mb-2 text-[var(--hud-primary)]">
                INCIDENT TITLE *
              </p>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Oil sheen spotted near coastline"
                className="w-full bg-transparent border border-[var(--hud-border)] text-[var(--hud-primary)] text-xs p-3 focus:outline-none focus:border-[var(--hud-primary)]"
                style={{ fontFamily: 'var(--font-hud)' }}
              />
            </div>

            {/* Location */}
            <div>
              <p className="text-xs tracking-widest opacity-50 mb-2 text-[var(--hud-primary)]">
                LOCATION *
              </p>
              <input
                type="text"
                value={form.location_name}
                onChange={e => setForm(prev => ({ ...prev, location_name: e.target.value }))}
                placeholder="e.g. city, state, coordinates"
                className="w-full bg-transparent border border-[var(--hud-border)] text-[var(--hud-primary)] text-xs p-3 focus:outline-none focus:border-[var(--hud-primary)]"
                style={{ fontFamily: 'var(--font-hud)' }}
              />
            </div>

            {/* Threat type */}
            <div>
              <p className="text-xs tracking-widest opacity-50 mb-2 text-[var(--hud-primary)]">
                THREAT TYPE *
              </p>
              <div className="grid grid-cols-2 gap-2">
                {THREAT_OPTIONS.map(threat => (
                  <button
                    key={threat.value}
                    onClick={() => setForm(prev => ({ ...prev, threat_type: threat.value }))}
                    className="text-left px-3 py-2 text-xs tracking-wider transition-all"
                    style={{
                      border: `1px solid ${form.threat_type === threat.value ? threat.color : 'rgba(0,212,255,0.15)'}`,
                      color: form.threat_type === threat.value ? threat.color : 'rgba(0,212,255,0.5)',
                      background: form.threat_type === threat.value ? `${threat.color}11` : 'transparent',
                      fontFamily: 'var(--font-hud)',
                      fontSize: 9,
                      letterSpacing: '0.1em',
                    }}
                  >
                    {threat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs tracking-widest opacity-50 mb-2 text-[var(--hud-primary)]">
                DESCRIPTION *
              </p>
              <textarea
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what you observed..."
                rows={3}
                className="w-full bg-transparent border border-[var(--hud-border)] text-[var(--hud-primary)] text-xs p-3 resize-none focus:outline-none focus:border-[var(--hud-primary)]"
                style={{ fontFamily: 'var(--font-hud)' }}
              />
            </div>

            {/* Reporter name */}
            <div>
              <p className="text-xs tracking-widest opacity-50 mb-2 text-[var(--hud-primary)]">
                YOUR NAME (OPTIONAL)
              </p>
              <input
                type="text"
                value={form.reporter_name}
                onChange={e => setForm(prev => ({ ...prev, reporter_name: e.target.value }))}
                placeholder="Anonymous"
                className="w-full bg-transparent border border-[var(--hud-border)] text-[var(--hud-primary)] text-xs p-3 focus:outline-none focus:border-[var(--hud-primary)]"
                style={{ fontFamily: 'var(--font-hud)' }}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs tracking-widest text-[#ff4444]">{error}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 text-xs tracking-[0.3em] transition-all disabled:opacity-30"
              style={{
                border: `1px solid ${threatColor}`,
                color: threatColor,
                background: `${threatColor}11`,
                fontFamily: 'var(--font-hud)',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'TRANSMITTING...' : '▶ SUBMIT REPORT'}
            </button>

          </div>
        )}
      </div>
    </div>
  )
}