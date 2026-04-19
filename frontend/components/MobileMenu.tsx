'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  onReport: () => void
  onFieldReports: () => void
  isDark: boolean
  onToggleTheme: () => void
}

export default function MobileMenu({ onReport, onFieldReports, isDark, onToggleTheme }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="relative">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
        style={{ border: '1px solid var(--hud-border)', background: 'rgba(0,212,255,0.05)' }}
      >
        <span
          className="block w-4 h-[1px] transition-all"
          style={{
            background: '#00d4ff',
            transform: open ? 'rotate(45deg) translate(4px, 4px)' : 'none',
          }}
        />
        <span
          className="block w-4 h-[1px] transition-all"
          style={{
            background: '#00d4ff',
            opacity: open ? 0 : 1,
          }}
        />
        <span
          className="block w-4 h-[1px] transition-all"
          style={{
            background: '#00d4ff',
            transform: open ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
          }}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className="absolute right-0 top-10 z-50 flex flex-col animate-fade-in"
          style={{
            background: 'rgba(2, 11, 20, 0.98)',
            border: '1px solid var(--hud-border)',
            minWidth: 180,
            boxShadow: '0 0 20px rgba(0,212,255,0.1)',
          }}
        >
          {[
            { label: isDark ? '☀️ LIGHT MODE' : '🌑 DARK MODE', action: () => { onToggleTheme(); setOpen(false) } },
            { label: 'ABOUT', action: () => { router.push('/about'); setOpen(false) } },
            { label: '+ REPORT', action: () => { onReport(); setOpen(false) } },
            { label: 'FIELD REPORTS', action: () => { onFieldReports(); setOpen(false) } },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="px-4 py-3 text-left text-xs tracking-widest opacity-70 hover:opacity-100 transition-opacity border-b border-[var(--hud-border)] last:border-b-0"
              style={{
                color: 'var(--hud-primary)',
                fontFamily: 'var(--font-hud)',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}