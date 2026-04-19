'use client'

import { useEffect, useState } from 'react'

type Props = {
  score: number
  color: string
}

export default function HealthBar({ score, color }: Props) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 100)
    return () => clearTimeout(t)
  }, [score])

  const segments = 20
  const filled = Math.round((width / 100) * segments)

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className="h-3 flex-1 transition-all duration-75"
          style={{
            background: i < filled ? color : 'rgba(255,255,255,0.05)',
            transitionDelay: `${i * 30}ms`,
            boxShadow: i < filled ? `0 0 4px ${color}88` : 'none',
          }}
        />
      ))}
    </div>
  )
}