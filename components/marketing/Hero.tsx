'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Play } from 'lucide-react'
import { useEffect, useState } from 'react'

const codeLines = [
  'async function fetchUser(id) {',
  '  const user = await db.find(id)',
  '  return user.name',
  '}',
]

const headingLines = ['Not Just', 'The Fix.', 'The Understanding.']

function TypingCode() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((v) => !v)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    if (currentLine >= codeLines.length) return

    const line = codeLines[currentLine]
    if (currentChar < line.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev]
          updated[currentLine] = line.substring(0, currentChar + 1)
          return updated
        })
        setCurrentChar((c) => c + 1)
      }, 35 + Math.random() * 25)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine((l) => l + 1)
        setCurrentChar(0)
        setDisplayedLines((prev) => [...prev, ''])
      }, 200)
      return () => clearTimeout(timeout)
    }
  }, [currentLine, currentChar])

  const finished = currentLine >= codeLines.length

  return (
    <div className="code-block text-[13px] leading-[1.7]">
      {displayedLines.map((line, i) => (
        <div key={i} className="flex">
          <span className="text-[var(--text-muted)] w-6 text-right mr-3 select-none text-[11px]">{i + 1}</span>
          <span>
            {i === 0 && (
              <>
                <span className="text-[var(--accent-blue)]">{line.substring(0, Math.min(line.length, 14))}</span>
                <span className="text-[var(--accent-green)]">{line.substring(14, Math.min(line.length, 24))}</span>
                <span className="text-[var(--text-muted)]">{line.substring(24)}</span>
              </>
            )}
            {i === 1 && (
              <>
                <span className="text-[var(--text-muted)]">{line.substring(0, Math.min(line.length, 16))}</span>
                <span className="text-[var(--accent-blue)]">{line.substring(16, Math.min(line.length, 21))}</span>
                <span className="text-[var(--text-muted)]">{line.substring(21)}</span>
              </>
            )}
            {i === 2 && <span className="text-[var(--text-muted)]">{line}</span>}
            {i === 3 && <span className="text-[var(--text-muted)]">{line}</span>}
          </span>
          {i === currentLine && !finished && (
            <span
              className="inline-block w-[1.5px] h-[16px] bg-[var(--accent-blue)] ml-[1px] self-center"
              style={{ opacity: showCursor ? 1 : 0 }}
            />
          )}
        </div>
      ))}
      {finished && (
        <div className="flex">
          <span className="text-[var(--text-muted)] w-6 text-right mr-3 select-none text-[11px]">&nbsp;</span>
          <span
            className="inline-block w-[1.5px] h-[16px] bg-[var(--accent-blue)]"
            style={{ animation: 'blink-cursor 1.1s step-end infinite' }}
          />
        </div>
      )}
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center pt-20 pb-12 overflow-hidden">
      {/* Subtle floating glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-[var(--accent-red)] opacity-[0.04] rounded-full blur-3xl"
          style={{ animation: 'float 10s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-[var(--accent-blue)] opacity-[0.03] rounded-full blur-3xl"
          style={{ animation: 'float-slow 12s ease-in-out infinite 3s' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="min-w-0">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-1.5 badge-red mb-5">
                <Sparkles className="w-3 h-3" />
                Built for developers who want to grow
              </div>
            </motion.div>

            {/* Heading */}
            <h1
              className="text-display leading-[1.05] mb-5"
              style={{ fontSize: 'clamp(1.875rem, 3.5vw + 0.25rem, 2.75rem)' }}
            >
              {headingLines.map((line, i) => (
                <motion.span
                  key={line}
                  className={`block ${i === 2 ? 'gradient-text' : 'text-[var(--text-primary)]'}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="text-[var(--text-secondary)] text-[15px] leading-relaxed mb-6 max-w-md"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              AI debugging that teaches you <em className="text-[var(--text-primary)] not-italic font-medium">why</em> your code broke — not just how to patch it.
              Track your weak spots and actually get better.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Link href="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary text-sm py-2.5 px-5"
                >
                  Start Debugging Free
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </Link>
              <Link href="#how-it-works">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary text-sm py-2.5 px-5"
                >
                  <Play className="w-3.5 h-3.5" />
                  See How It Works
                </motion.button>
              </Link>
            </motion.div>

            <motion.p
              className="text-[11px] text-[var(--text-muted)] mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Free forever · No credit card required · 10 sessions/month
            </motion.p>
          </div>

          {/* Right: Animated demo card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="card p-5 space-y-3">
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                <span className="text-[11px] text-[var(--text-muted)] ml-2 font-mono">app.js</span>
              </div>

              {/* Code with typing animation */}
              <TypingCode />

              {/* Error */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.5, duration: 0.3 }}
                className="p-2.5 bg-[rgba(255,92,124,0.08)] border border-[rgba(255,92,124,0.15)] rounded-md"
              >
                <p className="text-[12px] font-mono text-[var(--accent-red)]">
                  TypeError: Cannot read properties of null (reading &apos;name&apos;)
                </p>
              </motion.div>

              {/* Root cause result */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4.2, duration: 0.3 }}
                className="p-2.5 bg-[rgba(168,255,120,0.05)] border border-[rgba(168,255,120,0.12)] rounded-md"
              >
                <p className="text-[12px] font-medium text-[var(--accent-green)] mb-0.5">✓ Root Cause Found</p>
                <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
                  db.find() returns null when user doesn&apos;t exist. Add a null check before accessing properties.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-[var(--border)]">
          {[
            { value: '4.2h', label: 'Avg time lost debugging daily' },
            { value: '73%', label: "Devs can't explain their own fix" },
            { value: '63M', label: 'Developers worldwide' },
            { value: '₹0', label: 'To get started today' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-2xl font-display gradient-text">{stat.value}</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
