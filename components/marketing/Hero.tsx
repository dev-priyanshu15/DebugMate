'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Play } from 'lucide-react'

const codeDemo = [
  { step: 1, label: 'Paste Code + Error', color: 'var(--accent-red)', delay: 0 },
  { step: 2, label: 'Answer 3 Questions', color: 'var(--accent-blue)', delay: 0.2 },
  { step: 3, label: 'Get Debug Report', color: 'var(--accent-green)', delay: 0.4 },
]

const headingLines = ['Not Just', 'The Fix.', 'The Understanding.']

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden overflow-x-hidden">
      {/* Animated floating glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-red)] opacity-[0.06] rounded-full blur-3xl"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-blue)] opacity-[0.06] rounded-full blur-3xl"
          style={{ animation: 'float-slow 10s ease-in-out infinite 2s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-[var(--accent-green)] opacity-[0.03] rounded-full blur-3xl"
          style={{ animation: 'float 12s ease-in-out infinite 4s' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text content */}
          <div className="min-w-0">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 badge-red mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Built for developers who want to grow
              </div>
            </motion.div>

            {/* Heading — each line staggers in */}
            <h1
              className="text-display leading-[1.1] mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw + 0.3rem, 3rem)' }}
            >
              {headingLines.map((line, i) => (
                <motion.span
                  key={line}
                  className={`block ${i === 2 ? 'gradient-text' : 'text-[var(--text-primary)]'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8 max-w-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              AI debugging that teaches you <em>WHY</em> your code broke — not just how to patch it.
              Track your weak spots and actually get better over time.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link href="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary text-base py-3 px-6"
                  style={{ animation: 'pulse-glow 3s ease-in-out infinite 1.5s' }}
                >
                  Start Debugging Free
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="#how-it-works">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary text-base py-3 px-6"
                >
                  <Play className="w-4 h-4" />
                  See How It Works
                </motion.button>
              </Link>
            </motion.div>

            <motion.p
              className="text-xs text-[var(--text-muted)] mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Free forever · No credit card required · 10 sessions/month
            </motion.p>
          </div>

          {/* Right: Animated demo card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="card p-6 space-y-4">
              {/* Window chrome */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[var(--accent-red)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--accent-yellow)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--accent-green)]" />
                <span className="text-xs text-[var(--text-muted)] ml-2 font-mono">debugmate.dev</span>
              </div>

              {/* Code snippet with blinking cursor */}
              <div className="code-block text-xs">
                <span className="text-[var(--accent-blue)]">async function</span>{' '}
                <span className="text-[var(--accent-green)]">fetchUser</span>
                <span className="text-[var(--text-muted)]">(id) {'{'}</span>
                {'\n'}
                <span className="text-[var(--text-muted)] ml-4">const user = </span>
                <span className="text-[var(--accent-blue)]">await</span>
                <span className="text-[var(--text-muted)]"> db.find(id)</span>
                {'\n'}
                <span className="text-[var(--text-muted)] ml-4">return user.name</span>
                {'\n'}
                <span className="text-[var(--text-muted)]">{'}'}</span>
                <span
                  className="inline-block w-[2px] h-[14px] bg-[var(--accent-blue)] ml-0.5 align-middle"
                  style={{ animation: 'blink-cursor 1.1s step-end infinite' }}
                />
              </div>

              {/* Error */}
              <div className="p-3 bg-[rgba(255,77,109,0.1)] border border-[rgba(255,77,109,0.3)] rounded-btn">
                <p className="text-xs font-mono text-[var(--accent-red)]">
                  TypeError: Cannot read properties of null (reading &apos;name&apos;)
                </p>
              </div>

              {/* 3-step flow */}
              <div className="space-y-2">
                {codeDemo.map((item) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + item.delay, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-3 p-2.5 bg-[var(--surface-2)] rounded-btn border border-[var(--border)] cursor-default"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-display text-white flex-shrink-0"
                      style={{ background: item.color }}
                    >
                      {item.step}
                    </div>
                    <span className="text-xs font-ui text-[var(--text-secondary)]">{item.label}</span>
                    <div className="ml-auto w-2 h-2 rounded-full" style={{ background: item.color }} />
                  </motion.div>
                ))}
              </div>

              {/* Report preview */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
                className="p-3 bg-[rgba(168,255,120,0.05)] border border-[rgba(168,255,120,0.2)] rounded-btn"
              >
                <p className="text-xs font-ui text-[var(--accent-green)] mb-1">✓ Root Cause Found</p>
                <p className="text-xs text-[var(--text-muted)]">
                  db.find() returns null when user doesn&apos;t exist. Add null check before accessing properties.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats row — staggered */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-[var(--border)]">
          {[
            { value: '4.2h', label: 'Avg time lost debugging daily' },
            { value: '73%', label: "Devs can't explain their own fix" },
            { value: '63M', label: 'Developers worldwide' },
            { value: '₹0', label: 'To get started today' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-3xl font-display gradient-text">{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
