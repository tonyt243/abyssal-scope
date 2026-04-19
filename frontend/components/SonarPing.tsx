'use client'

import { useEffect, useState } from 'react'

type Props = {
  color: string
  onDone: () => void
}

export default function SonarPing({ color, onDone }: Props) {
  const [rings, setRings] = useState([0])

  useEffect(() => {
    const t1 = setTimeout(() => setRings([0, 1]), 200)
    const t2 = setTimeout(() => setRings([0, 1, 2]), 400)
    const t3 = setTimeout(() => onDone(), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
      {rings.map(i => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 60,
            height: 60,
            border: `2px solid ${color}`,
            animation: `sonar-ping 1.4s ease-out ${i * 0.2}s forwards`,
            opacity: 0,
          }}
        />
      ))}
      <div
        className="w-3 h-3 rounded-full"
        style={{ background: color, boxShadow: `0 0 12px ${color}` }}
      />
    </div>
  )
}