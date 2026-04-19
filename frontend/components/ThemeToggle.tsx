'use client'

import { useEffect } from 'react'

type Props = {
  isDark: boolean
  onToggle: () => void
}

export default function ThemeToggle({ isDark, onToggle }: Props) {
  useEffect(() => {
    if (isDark) {
      document.body.classList.remove('light-mode')
    } else {
      document.body.classList.add('light-mode')
    }
  }, [isDark])

  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1 text-xs tracking-widest transition-all"
      style={{
        border: '1px solid var(--hud-border)',
        color: 'var(--hud-primary)',
        background: 'transparent',
        fontFamily: 'var(--font-hud)',
      }}
    >
      <span style={{ fontSize: 14 }}>{isDark ? '☀️' : '🌑'}</span>
      {isDark ? 'LIGHT' : 'DARK'}
    </button>
  )
}