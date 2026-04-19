'use client'

import { useEffect, useState } from 'react'

const BOOT_LINES = [
  '> INITIALIZING ABYSSALSCOPE v1.0...',
  '> CONNECTING TO OCEAN MONITORING NETWORK...',
  '> LOADING THREAT DATABASE... 20 REGIONS FOUND',
  '> CALIBRATING SONAR ARRAY...',
  '> ESTABLISHING DEEP SEA CHANNELS...',
  '> DEPLOYING SUBMARINE UNIT ALPHA...',
  '> ALL SYSTEMS NOMINAL',
  '> CONTACT ESTABLISHED WITH THE DEEP',
]

type Props = {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: Props) {
  const [lines, setLines] = useState<string[]>([])
  const [sonarAngle, setSonarAngle] = useState(0)
  const [subY, setSubY] = useState(-100)
  const [done, setDone] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [bootComplete, setBootComplete] = useState(false)

  // Boot text lines
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]])
        i++
      } else {
        clearInterval(interval)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])


  useEffect(() => {
    const t = setTimeout(() => setBootComplete(true), BOOT_LINES.length * 400 + 500)
    return () => clearTimeout(t)
  }, [])

  // Sonar sweep rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setSonarAngle(prev => (prev + 3) % 360)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  // Submarine dive animation
  useEffect(() => {
    let frame: number
    let start: number
    const duration = 5000
    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const ease = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress
      setSubY(-100 + ease * 450)
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  const handleProceed = () => {
    setFadeOut(true)
    setTimeout(() => {
      setDone(true)
      onComplete()
    }, 600)
  }

  if (done) return null

  return (
    <div
      className="fixed inset-0 z-[9998] flex"
      style={{
        background: '#020b14',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
    >
      {/* Left panel — sonar + submarine */}
      <div className="w-1/2 flex items-center justify-center relative overflow-hidden">

        {/* Deep sea depth lines */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full"
            style={{
              top: `${10 + i * 11}%`,
              borderTop: '1px solid rgba(0, 212, 255, 0.05)',
            }}
          />
        ))}

        {/* Sonar circle */}
        <div className="relative" style={{ width: 280, height: 280 }}>

          {/* Outer rings */}
          {[1, 0.66, 0.33].map((scale, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                inset: `${(1 - scale) * 140}px`,
                border: '1px solid rgba(0, 212, 255, 0.2)',
              }}
            />
          ))}

          {/* Cross hairs */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div style={{ width: '100%', height: '1px', background: 'rgba(0,212,255,0.15)' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div style={{ width: '1px', height: '100%', background: 'rgba(0,212,255,0.15)' }} />
          </div>

          {/* Sonar sweep */}
          <div
            className="absolute inset-0"
            style={{ transform: `rotate(${sonarAngle}deg)` }}
          >
            <div
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                width: '50%',
                height: '2px',
                transformOrigin: '0% 50%',
                background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.8))',
                boxShadow: '0 0 8px rgba(0,212,255,0.5)',
              }}
            />
          </div>

          {/* Sonar glow trail */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from ${sonarAngle}deg, rgba(0,212,255,0.08) 0deg, transparent 60deg)`,
            }}
          />

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: '#00d4ff', boxShadow: '0 0 12px #00d4ff' }}
            />
          </div>

          {/* Random blips */}
          {[
            { x: 65, y: 40 }, { x: 30, y: 70 },
            { x: 80, y: 75 }, { x: 45, y: 25 },
            { x: 70, y: 60 }, { x: 20, y: 55 },
          ].map((blip, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-pulse"
              style={{
                left: `${blip.x}%`,
                top: `${blip.y}%`,
                background: i % 2 === 0 ? '#ff4444' : '#ffaa00',
                boxShadow: `0 0 6px ${i % 2 === 0 ? '#ff4444' : '#ffaa00'}`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Submarine diving */}
        <div
          className="absolute left-1/2 pointer-events-none"
          style={{
            top: subY,
            transform: 'translateX(-50%) rotate(90deg)',
            filter: 'drop-shadow(0 0 6px #00d4ff) drop-shadow(0 0 12px #00aaff)',
          }}
        >
          <img
            src="/submarine.png"
            alt="submarine"
            style={{ width: 60, height: 'auto' }}
          />
        </div>

        {/* Depth indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          style={{
            color: 'rgba(0,212,255,0.5)',
            fontSize: 11,
            letterSpacing: '0.3em',
            fontFamily: 'var(--font-hud)',
          }}
        >
          DEPTH: {Math.max(0, Math.round(subY + 100))}m
        </div>
      </div>

      {/* Right panel — boot terminal */}
      <div className="w-1/2 flex flex-col justify-center px-12 border-l border-[var(--hud-border)]">

        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-[var(--hud-primary)] animate-pulse" />
            <span style={{
              color: '#00d4ff',
              fontSize: 22,
              letterSpacing: '0.4em',
              fontFamily: 'var(--font-hud)',
              fontWeight: 'bold',
            }}>
              ABYSSAL SCOPE
            </span>
          </div>
          <p style={{
            color: 'rgba(0,212,255,0.4)',
            fontSize: 10,
            letterSpacing: '0.3em',
            fontFamily: 'var(--font-hud)',
          }}>
            OCEAN THREAT MONITORING SYSTEM v1.0
          </p>
        </div>

        {/* Boot lines */}
        <div className="space-y-2">
          {lines.map((line, i) => (
            <div
              key={i}
              className="text-xs animate-fade-in"
              style={{
                fontFamily: 'var(--font-hud)',
                color: (line?.includes('NOMINAL') || line?.includes('ESTABLISHED'))
                  ? '#00ff88'
                  : (line?.includes('DEPLOYING') || line?.includes('CALIBRATING'))
                  ? '#ffaa00'
                  : 'rgba(0,212,255,0.7)',
                letterSpacing: '0.05em',
              }}
            >
              {line}
              {i === lines.length - 1 && !bootComplete && (
                <span className="inline-block w-2 h-3 bg-[var(--hud-primary)] ml-1 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div
            className="h-[2px] bg-[rgba(0,212,255,0.1)] relative overflow-hidden"
            style={{ width: '100%' }}
          >
            <div
              className="h-full bg-[var(--hud-primary)] absolute left-0 top-0"
              style={{
                width: `${Math.min((lines.length / BOOT_LINES.length) * 100, 100)}%`,
                transition: 'width 0.4s ease',
                boxShadow: '0 0 8px #00d4ff',
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span style={{
              color: 'rgba(0,212,255,0.4)',
              fontSize: 9,
              letterSpacing: '0.2em',
              fontFamily: 'var(--font-hud)',
            }}>
              SYSTEM BOOT
            </span>
            <span style={{
              color: 'rgba(0,212,255,0.4)',
              fontSize: 9,
              letterSpacing: '0.2em',
              fontFamily: 'var(--font-hud)',
            }}>
              {Math.round((lines.length / BOOT_LINES.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Proceed button — appears after boot */}
        {bootComplete && (
          <button
            onClick={handleProceed}
            className="mt-8 animate-fade-in"
            style={{
              border: '1px solid #00d4ff',
              color: '#00d4ff',
              background: 'rgba(0, 212, 255, 0.05)',
              fontFamily: 'var(--font-hud)',
              fontSize: 12,
              letterSpacing: '0.4em',
              padding: '12px 32px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 20px rgba(0,212,255,0.1)',
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.background = 'rgba(0,212,255,0.15)'
              ;(e.target as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(0,212,255,0.3)'
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.background = 'rgba(0,212,255,0.05)'
              ;(e.target as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0,212,255,0.1)'
            }}
          >
            ▶ DIVE IN
          </button>
        )}
      </div>
    </div>
  )
}