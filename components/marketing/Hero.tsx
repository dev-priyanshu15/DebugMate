'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { useEffect, useState } from 'react'

const codeLines = [
  { text: 'async function fetchUser(id) {', tokens: [{ text: 'async function', cls: 'text-[#7dd3fc]' }, { text: ' fetchUser(id) {', cls: 'text-[#e4e8f0]' }] },
  { text: '  const user = await db.find(id)', tokens: [{ text: '  const ', cls: 'text-[#7dd3fc]' }, { text: 'user = ', cls: 'text-[#e4e8f0]' }, { text: 'await ', cls: 'text-[#7dd3fc]' }, { text: 'db.find(id)', cls: 'text-[#e4e8f0]' }] },
  { text: '  return user.name', tokens: [{ text: '  return ', cls: 'text-[#7dd3fc]' }, { text: 'user.name', cls: 'text-[#e4e8f0]' }] },
  { text: '}', tokens: [{ text: '}', cls: 'text-[#e4e8f0]' }] },
]

const headingLines = [
  { text: 'Not Just', color: 'var(--muted-2)', delay: 0.1 },
  { text: 'The Fix.', color: 'var(--text)', delay: 0.18 },
  { text: 'The Understanding.', color: 'var(--accent-light)', delay: 0.26 },
]

const easeOut = [0, 0, 0.2, 1] as const

function TypingCode() {
  const [displayed, setDisplayed] = useState<string[]>([])
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    if (lineIdx >= codeLines.length) return
    const line = codeLines[lineIdx].text
    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setDisplayed(prev => {
          const u = [...prev]
          u[lineIdx] = line.substring(0, charIdx + 1)
          return u
        })
        setCharIdx(c => c + 1)
      }, 30 + Math.random() * 20)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setLineIdx(l => l + 1)
        setCharIdx(0)
        setDisplayed(prev => [...prev, ''])
      }, 150)
      return () => clearTimeout(t)
    }
  }, [lineIdx, charIdx])

  const done = lineIdx >= codeLines.length

  return (
    <div
      className="text-[13px] leading-[1.55] p-4 rounded-lg"
      style={{ fontFamily: "'JetBrains Mono', monospace", background: 'var(--code-bg)', border: '1px solid var(--border)' }}
    >
      {codeLines.map((line, i) => {
        if (i > lineIdx) return null
        const currentText = displayed[i] || ''
        return (
          <div key={i} className="flex">
            <span className="text-[var(--muted-2)] w-5 text-right mr-3 select-none text-[11px]">{i + 1}</span>
            <span>
              {line.tokens.map((token, ti) => {
                const tokenStart = line.tokens.slice(0, ti).reduce((s, t) => s + t.text.length, 0)
                if (tokenStart >= currentText.length) return null
                const visibleText = token.text.substring(0, Math.max(0, currentText.length - tokenStart))
                return <span key={ti} className={token.cls}>{visibleText}</span>
              })}
            </span>
            {i === lineIdx && !done && (
              <span className="inline-block w-[1.5px] h-[15px] bg-[var(--accent)] ml-px self-center" style={{ animation: 'blink-cursor 1s step-end infinite' }} />
            )}
          </div>
        )
      })}
      {done && (
        <div className="flex">
          <span className="text-[var(--muted-2)] w-5 text-right mr-3 select-none text-[11px]">&nbsp;</span>
          <span className="inline-block w-[1.5px] h-[15px] bg-[var(--accent)]" style={{ animation: 'blink-cursor 1s step-end infinite' }} />
        </div>
      )}
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-[72px] pb-12 overflow-hidden">
      {/* Hero radial glow — subtle teal */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%', left: '5%', width: '60%', height: '80%',
          background: 'radial-gradient(ellipse 60% 40% at 30% 50%, rgba(56,189,248,0.06) 0%, transparent 70%)',
          animation: 'hero-glow 8s ease-in-out infinite',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 w-full relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left: Text */}
          <div className="min-w-0">
            <h1 style={{ fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 1.05 }}>
              {headingLines.map((line) => (
                <motion.span
                  key={line.text}
                  className="block text-display"
                  style={{ color: line.color }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: line.delay, ease: easeOut }}
                >
                  {line.text}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="text-[var(--muted)] text-[14px] leading-relaxed mt-6 mb-8 max-w-[460px]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35, ease: easeOut }}
            >
              You fixed the bug. But you don&apos;t know why it happened. Next month, same class of error, different codebase, same confusion. DebugMate breaks that loop.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.42, ease: easeOut }}
            >
              <Link href="/sign-up">
                <button className="btn-primary">
                  Try it
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
              <Link href="#how-it-works">
                <button className="btn-secondary">
                  <Play className="w-3.5 h-3.5" />
                  See how it works
                </button>
              </Link>
            </motion.div>

            <motion.p
              className="text-[11px] text-[var(--muted-2)] mt-4 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.48, ease: easeOut }}
            >
              free, no card, 10 sessions/mo
            </motion.p>
          </div>

          {/* Right: Code card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: easeOut }}
          >
            <div className="card p-0 overflow-hidden" style={{ borderColor: 'var(--border)', borderRadius: '12px' }}>
              <div className="flex items-center gap-[6px] px-4 py-3" style={{ background: 'var(--surface-2)' }}>
                <div className="w-[10px] h-[10px] rounded-full" style={{ background: '#ff5f56' }} />
                <div className="w-[10px] h-[10px] rounded-full" style={{ background: '#ffbd2e' }} />
                <div className="w-[10px] h-[10px] rounded-full" style={{ background: '#27c93f' }} />
                <span className="text-[12px] text-[var(--muted-2)] ml-3 font-mono">app.js</span>
              </div>

              <div className="p-4 space-y-2.5">
                <TypingCode />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3, duration: 0.3, ease: easeOut }}
                  className="p-3 border border-[var(--border)] rounded-lg"
                  style={{ background: 'rgba(248, 113, 113, 0.04)' }}
                >
                  <p className="text-[12px] font-mono" style={{ color: 'var(--error)' }}>
                    TypeError: Cannot read properties of null (reading &apos;name&apos;)
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.8, duration: 0.3, ease: easeOut }}
                  className="p-3 border border-[var(--border)] rounded-lg"
                  style={{ background: 'rgba(45, 212, 191, 0.04)' }}
                >
                  <p className="text-[12px] font-mono text-[var(--green)] mb-0.5">✓ Root Cause Found</p>
                  <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                    db.find() returns null when user doesn&apos;t exist. Add a null check before accessing properties.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-x-12 gap-y-4 mt-20 pt-8 border-t border-[var(--border)]">
          {[
            { value: '4.2h', label: 'AVG WORKDAY LOST TO DEBUGGING' },
            { value: '73%', label: 'OF DEVS CAN\'T EXPLAIN THEIR OWN FIX' },
            { value: '63M', label: 'DEVELOPERS, MOSTLY DEBUGGING ALONE' },
            { value: '₹0', label: 'WHAT THIS COSTS TO FIND OUT' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 + i * 0.07, ease: easeOut }}
            >
              <p className="text-[28px] font-bold text-[var(--text)]">{stat.value}</p>
              <p className="text-[11px] text-[var(--muted-2)] uppercase tracking-wider mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
