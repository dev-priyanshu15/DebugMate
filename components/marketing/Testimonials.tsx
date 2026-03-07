'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const testimonials = [
  {
    name: 'ARJUN SHARMA',
    role: 'Junior Developer @ Razorpay',
    initials: 'AS',
    quote: 'Had a useEffect cleanup bug that was causing a memory leak. DebugMate pointed out I was missing the return function in the effect and explained how closures retain references. Haven\'t leaked since.',
    gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(59, 130, 246, 0.12) 50%, rgba(6, 182, 212, 0.08) 100%)',
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  {
    name: 'PRIYA NAIR',
    role: 'Bootcamp Student, Masai School',
    initials: 'PN',
    quote: 'Honestly didn\'t think this would be better than just asking ChatGPT. But the three questions it asks before answering actually forced me to think about my own code. That\'s the part that teaches you.',
    gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(56, 189, 248, 0.1) 50%, rgba(99, 102, 241, 0.08) 100%)',
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  {
    name: 'RAHUL GUPTA',
    role: 'Solo Founder',
    initials: 'RG',
    quote: 'Spent 3 hours on a race condition in my payment webhook handler. Pasted it here, got the report in 2 minutes. The "What To Learn" card told me to study event ordering. Now I actually get it.',
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(99, 102, 241, 0.15) 50%, rgba(139, 92, 246, 0.1) 100%)',
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
]

const easeOut = [0, 0, 0.2, 1] as const

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.12 })

  return (
    <section className="py-[96px] px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45, ease: easeOut }}
        >
          <h2 className="text-display text-3xl text-[var(--text)] mb-2">What people said</h2>
          <p className="text-[15px] text-[var(--muted)]">Unedited, from people who actually used it</p>
        </motion.div>

        <div ref={ref} className="grid md:grid-cols-3 gap-5 items-stretch">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.42, delay: i * 0.1, ease: easeOut }}
              className="rounded-2xl p-6 flex flex-col backdrop-blur-sm"
              style={{
                background: t.gradient,
                border: `1px solid ${t.borderColor}`,
              }}
            >
              <p className="text-[14px] text-[var(--text)] leading-relaxed mb-6 flex-1" style={{ opacity: 0.9 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 flex items-center justify-center text-[13px] font-bold flex-shrink-0 rounded-full"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--accent-light)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[var(--text)]">{t.name}</p>
                  <p className="text-[12px] text-[var(--muted)]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
