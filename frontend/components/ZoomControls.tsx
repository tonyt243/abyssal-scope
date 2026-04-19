'use client'

import { useMap } from 'react-leaflet'

export default function ZoomControls() {
  const map = useMap()

  return (
    <div
      className="absolute bottom-8 right-6 z-[1000] flex flex-col gap-1"
    >
      <button
        onClick={() => map.zoomIn()}
        className="w-8 h-8 flex items-center justify-center text-lg transition-opacity hover:opacity-100 opacity-70"
        style={{
          border: '1px solid var(--hud-border)',
          color: 'var(--hud-primary)',
          background: 'var(--hud-surface)',
          fontFamily: 'var(--font-hud)',
        }}
      >
        +
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-8 h-8 flex items-center justify-center text-lg transition-opacity hover:opacity-100 opacity-70"
        style={{
          border: '1px solid var(--hud-border)',
          color: 'var(--hud-primary)',
          background: 'var(--hud-surface)',
          fontFamily: 'var(--font-hud)',
        }}
      >
        −
      </button>
    </div>
  )
}