'use client'

import { useEffect, useState } from 'react'
import { OceanRegion } from '@/lib/supabase'

type Props = {
  regions: OceanRegion[]
}

export default function HudStats({ regions }: Props) {
  const [reportCount, setReportCount] = useState(0)
  const [displayCount, setDisplayCount] = useState(0)

  // Fetch community report count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`)
        const data = await res.json()
        setReportCount(data.length)
      } catch {
        setReportCount(0)
      }
    }
    fetchCount()
    // Refresh every 30 seconds
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  // Animate count up
  useEffect(() => {
    if (reportCount === 0) return
    let current = 0
    const step = Math.ceil(reportCount / 20)
    const interval = setInterval(() => {
      current = Math.min(current + step, reportCount)
      setDisplayCount(current)
      if (current >= reportCount) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [reportCount])

  // Average health score
  const avgHealth = regions.length
    ? Math.round(regions.reduce((sum, r) => sum + r.health_score, 0) / regions.length)
    : 0

  const healthColor = avgHealth < 30 ? '#ff4444' : avgHealth < 50 ? '#ffaa00' : '#00d4ff'

  return (
    <div className="flex items-center gap-4">

      {/* Community reports */}
      <div className="flex items-center gap-2">
        <span className="text-xs opacity-40 tracking-widest text-[var(--hud-primary)]">
          FIELD REPORTS
        </span>
        <span
          className="text-xs font-bold tracking-widest text-[var(--hud-primary)]"
          style={{ fontFamily: 'var(--font-hud)' }}
        >
          {displayCount}
        </span>
      </div>

      <span className="text-[var(--hud-primary)] opacity-20">|</span>

      {/* Regions tracked */}
      <div className="flex items-center gap-2">
        <span className="text-xs opacity-40 tracking-widest text-[var(--hud-primary)]">
          REGIONS
        </span>
        <span
          className="text-xs font-bold tracking-widest text-[var(--hud-primary)]"
          style={{ fontFamily: 'var(--font-hud)' }}
        >
          {regions.length}
        </span>
      </div>
    </div>
  )
}