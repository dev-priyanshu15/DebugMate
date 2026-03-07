'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const testimonials = [
  {
    name: 'ARJUN SHARMA',
    role: 'Junior Developer @ Razorpay',
    initials: 'AS',
    quote: 'Had a useEffect cleanup bug that was causing a memory leak. DebugMate pointed out I was missing the return function in the effect and explained how closures retain references. Haven\'t leaked since.',
    padding: '24px',
  },
  {
    name: 'PRIYA NAIR',
    role: 'Bootcamp Student, Masai School',
    initials: 'PN',
    quote: 'Honestly didn\'t think this would be better than just asking ChatGPT. But the three questions it asks before answering actually forced me to think about my own code. That\'s the part that teaches you.',
    padding: '20px',
  },
  {
    name: 'RAHUL GUPTA',
    role: 'Solo Founder',
    initials: 'RG',
    quote: 'Spent 3 hours on a race condition in my payment webhook handler. Pasted it here, got the report in 2 minutes. The "What To Learn" card told me to study event ordering. Now I actually get it.',
    padding: '28px',
  },
]

const easeOut = [0, 0, 0.2, 1] as const

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section className="py-[96px] px-6" style={{ background: 'var(--surface)' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, ease: easeOut }}
        >
          <h2 className="text-display text-3xl text-[var(--text)] mb-2">What people said</h2>
          <p className="text-[13px] text-[var(--muted)]">Unedited, from people who actually used it</p>
        </motion.div>

        <div ref={ref} className="grid md:grid-cols-3 gap-5 items-start">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.38, delay: i * 0.1, ease: easeOut }}
              className="card-hover"
              style={{ padding: t.padding }}
            >
              <p className="text-[14px] italic text-[var(--muted)] leading-relaxed mb-5">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 flex items-center justify-center text-[11px] font-bold text-[var(--accent)] flex-shrink-0"
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    borderRadius: '6px',
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text)]">{t.name}</p>
                  <p className="text-[11px] text-[var(--muted-2)]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
