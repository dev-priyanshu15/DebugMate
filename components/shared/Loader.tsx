'use client'

import { useState, useEffect } from 'react'

const statusMessages = [
  { time: 0, text: 'initializing runtime...' },
  { time: 900, text: 'loading context engine...' },
  { time: 1800, text: 'compiling debug model...' },
  { time: 2600, text: 'ready.' },
]

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [status, setStatus] = useState(statusMessages[0].text)
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timers = statusMessages.map((msg) =>
      setTimeout(() => setStatus(msg.text), msg.time)
    )

    const fadeTimer = setTimeout(() => setFading(true), 2800)
    const doneTimer = setTimeout(() => {
      setVisible(false)
      onComplete()
    }, 3200)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: '#050810',
        transition: 'opacity 400ms ease',
        opacity: fading ? 0 : 1,
      }}
    >
      <div
        className="text-[22px] font-bold tracking-[0.22em] text-[var(--text)] mb-8"
        style={{ animation: 'glitch 4s infinite' }}
      >
        DEBUGMATE
      </div>
      <div className="relative" style={{ width: 'min(340px, 80vw)', height: '2px', background: '#1c2540' }}>
        <div
          className="absolute inset-y-0 left-0"
          style={{
            background: 'var(--gradient-primary)',
            boxShadow: '0 0 14px rgba(56, 189, 248, 0.4)',
            animation: 'progress-fill 2.8s linear forwards',
          }}
        />
      </div>
      <p className="mt-4 text-[11px] text-[var(--muted-2)] font-mono">{status}</p>
    </div>
  )
}
