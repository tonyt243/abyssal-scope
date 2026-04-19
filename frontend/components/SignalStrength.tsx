'use client'

import { useEffect, useState } from 'react'

export default function SignalStrength() {
  const [strength, setStrength] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => {
      setStrength(Math.floor(Math.random() * 2) + 3)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-end gap-[2px] h-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className="w-[3px] transition-all duration-300"
          style={{
            height: `${i * 20}%`,
            background: i <= strength ? 'var(--hud-primary)' : 'rgba(0,212,255,0.15)',
          }}
        />
      ))}
    </div>
  )
}