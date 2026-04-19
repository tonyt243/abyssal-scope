'use client'

import { useState, useRef, useEffect } from 'react'
import { OceanRegion } from '@/lib/supabase'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type Props = {
  region: OceanRegion
  monologue: string
  onBack: () => void
}

const THREAT_COLORS: Record<string, string> = {
  coral_bleaching: '#ff6b35',
  dead_zone:       '#8b00ff',
  pollution:       '#ff4444',
  ice_melt:        '#00aaff',
  overfishing:     '#ffaa00',
  acidification:   '#ff00aa',
}

export default function DialoguePanel({ region, monologue, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [currentStream, setCurrentStream] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const threatColor = THREAT_COLORS[region.primary_threat] ?? '#00d4ff'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentStream])

  const sendMessage = async () => {
    if (!input.trim() || streaming) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setStreaming(true)
    setCurrentStream('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region_name:         region.name,
          primary_threat:      region.primary_threat,
          health_score:        region.health_score,
          threat_description:  region.threat_description,
          temperature_anomaly: region.temperature_anomaly,
          monologue,
          messages: newMessages,
        }),
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let full = ''

      if (!reader) return

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        full += chunk
        setCurrentStream(full)
      }

      setMessages(prev => [...prev, { role: 'assistant', content: full }])
      setCurrentStream('')
    } catch (err) {
      console.error('Chat failed:', err)
    } finally {
      setStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="absolute inset-0 z-20 flex items-end md:items-center justify-center bg-black/70">
      <div
        className="hud-border hud-corner bg-[var(--hud-surface)] w-full md:max-w-2xl md:mx-4 flex flex-col"
        style={{
          height: '90vh',
          borderColor: `${threatColor}44`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-[var(--hud-border)]">
          <div>
            <p className="text-xs tracking-[0.4em] opacity-50 mb-1" style={{ color: threatColor }}>
              OPEN CHANNEL
            </p>
            <h2 className="text-sm md:text-lg tracking-widest" style={{ color: threatColor }}>
              {region.name.toUpperCase()}
            </h2>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: threatColor }} />
              <span className="text-xs tracking-widest opacity-60 hidden sm:block" style={{ color: threatColor }}>
                LIVE
              </span>
            </div>
            <button
              onClick={onBack}
              className="text-xs tracking-widest opacity-40 hover:opacity-80 transition-opacity text-[var(--hud-primary)]"
            >
              ✕ DISCONNECT
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-xs tracking-[0.3em] opacity-40 animate-pulse text-[var(--hud-primary)]">
                THE OCEAN IS LISTENING — TYPE TO RESPOND
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-[85%] md:max-w-[80%] px-3 md:px-4 py-2 md:py-3 text-sm leading-relaxed"
                style={msg.role === 'user' ? {
                  background: 'rgba(0, 212, 255, 0.08)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  color: '#00d4ff',
                } : {
                  background: `${threatColor}11`,
                  border: `1px solid ${threatColor}33`,
                  color: threatColor,
                }}
              >
                {msg.role === 'assistant' && (
                  <p className="text-xs tracking-widest opacity-50 mb-2">
                    {region.name.toUpperCase()}
                  </p>
                )}
                {msg.role === 'user' && (
                  <p className="text-xs tracking-widest opacity-50 mb-2 text-right">
                    YOU
                  </p>
                )}
                <p>{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Streaming response */}
          {currentStream && (
            <div className="flex justify-start">
              <div
                className="max-w-[85%] md:max-w-[80%] px-3 md:px-4 py-2 md:py-3 text-sm leading-relaxed"
                style={{
                  background: `${threatColor}11`,
                  border: `1px solid ${threatColor}33`,
                  color: threatColor,
                }}
              >
                <p className="text-xs tracking-widest opacity-50 mb-2">
                  {region.name.toUpperCase()}
                </p>
                <p>{currentStream}
                  <span className="inline-block w-2 h-3 ml-1 animate-pulse" style={{ background: threatColor }} />
                </p>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-t border-[var(--hud-border)]">
          <div className="flex gap-2 md:gap-3 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Speak to the ocean..."
              rows={2}
              disabled={streaming}
              className="flex-1 bg-transparent border border-[var(--hud-border)] text-[var(--hud-primary)] text-xs md:text-sm p-2 md:p-3 resize-none focus:outline-none focus:border-[var(--hud-primary)] placeholder-[var(--hud-primary)] placeholder-opacity-30 tracking-wide"
              style={{ fontFamily: 'var(--font-hud)' }}
            />
            <button
              onClick={sendMessage}
              disabled={streaming || !input.trim()}
              className="px-3 md:px-4 py-3 text-xs tracking-widest transition-all disabled:opacity-30 shrink-0"
              style={{
                border: `1px solid ${threatColor}`,
                color: threatColor,
                background: streaming ? `${threatColor}11` : 'transparent',
              }}
            >
              {streaming ? '...' : '→'}
            </button>
          </div>
          <p className="text-xs opacity-30 mt-1 tracking-widest text-[var(--hud-primary)] hidden md:block">
            ENTER TO SEND — SHIFT+ENTER FOR NEW LINE
          </p>
        </div>
      </div>
    </div>
  )
}