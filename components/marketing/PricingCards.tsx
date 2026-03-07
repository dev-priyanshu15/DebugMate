'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'For trying it out or light usage',
    price: { monthly: 0, yearly: 0 },
    sessions: '10/month',
    features: [
      '10 debug sessions per month',
      'Full debug reports with root cause',
      'What To Learn recommendations',
      'Session history (last 30 days)',
    ],
    cta: 'Start Free',
    highlighted: false,
    padding: '24px',
    href: '/sign-up',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For daily debugging and learning',
    price: { monthly: 499, yearly: 4990 },
    sessions: 'Unlimited',
    features: [
      'Unlimited debug sessions',
      'Full debug reports with root cause',
      'Weak spot analysis over time',
      'Priority AI processing',
      'Session history (forever)',
      'Export reports as PDF',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
    padding: '24px',
  },
  {
    id: 'bootcamp',
    name: 'Bootcamp',
    description: 'For instructors running a cohort',
    price: { monthly: 2999, yearly: 29990 },
    sessions: '50 seats',
    features: [
      'Everything in Pro',
      'Up to 50 student seats',
      'Instructor dashboard',
      'Student-level weak spot tracking',
      'Team invite via code',
      'Priority email support',
    ],
    cta: 'Contact Us',
    highlighted: false,
    padding: '28px',
  },
]

const easeOut = [0, 0, 0.2, 1] as const

interface PricingCardsProps {
  onUpgrade?: (planId: string, billing: 'monthly' | 'yearly') => void
}

export function PricingCards({ onUpgrade }: PricingCardsProps) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section className="py-[72px] px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, ease: easeOut }}
        >
          <h2 className="text-display text-3xl text-[var(--text)] mb-2">What it costs</h2>
          <p className="text-[13px] text-[var(--muted)] mb-6">Two plans and a team option. That&apos;s it.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-0.5 p-[3px] border border-[var(--border)] rounded-md" style={{ background: 'var(--surface)' }}>
            <button
              onClick={() => setBilling('monthly')}
              className="px-3 py-1 rounded text-[13px] font-medium transition-all duration-200"
              style={{
                background: billing === 'monthly' ? 'var(--accent)' : 'transparent',
                color: billing === 'monthly' ? 'white' : 'var(--muted-2)',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className="px-3 py-1 rounded text-[13px] font-medium transition-all duration-200 flex items-center gap-2"
              style={{
                background: billing === 'yearly' ? 'var(--accent)' : 'transparent',
                color: billing === 'yearly' ? 'white' : 'var(--muted-2)',
              }}
            >
              Yearly
              <span className="tag text-[10px]">SAVE 16%</span>
            </button>
          </div>
        </motion.div>

        <div ref={ref} className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.38, delay: i * 0.09, ease: easeOut }}
              className="card-hover relative"
              style={{
                padding: plan.padding,
                borderColor: plan.highlighted ? 'var(--accent)' : undefined,
              }}
            >
              {plan.highlighted && (
                <div className="absolute top-3 right-3">
                  <span className="tag-bordered text-[9px]">POPULAR</span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="font-bold text-lg text-[var(--text)] mb-0.5">{plan.name}</h3>
                <p className="text-[11px] text-[var(--muted-2)]">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-[36px] font-bold font-mono text-[var(--text)]">
                  {plan.price[billing] === 0 ? '₹0' : `₹${plan.price[billing].toLocaleString('en-IN')}`}
                </span>
                {plan.price[billing] > 0 && (
                  <span className="text-[var(--muted-2)] text-[12px] ml-1">/{billing === 'monthly' ? 'mo' : 'yr'}</span>
                )}
                <p className="text-[11px] text-[var(--muted-2)] mt-0.5">{plan.sessions} sessions</p>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[13px] text-[var(--muted)]">
                    <span className="text-[var(--accent)] mt-0.5">→</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.id === 'free' ? (
                <Link href={plan.href!}>
                  <button className="btn-secondary w-full justify-center text-[13px]">{plan.cta}</button>
                </Link>
              ) : plan.id === 'bootcamp' ? (
                <a href="mailto:hello@debugmate.dev">
                  <button className="btn-secondary w-full justify-center text-[13px]">{plan.cta}</button>
                </a>
              ) : (
                <button onClick={() => onUpgrade?.(plan.id, billing)} className="btn-primary w-full justify-center text-[13px]">{plan.cta}</button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
