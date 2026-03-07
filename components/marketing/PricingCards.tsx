'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'lucide-react'

const plans = [
  {
    id: 'free',
    name: 'Starter',
    description: 'Perfect for developers trying out DebugMate.',
    price: { monthly: 0, yearly: 0 },
    sessions: '10/month',
    features: [
      '10 debug sessions per month',
      'Full debug reports with root cause',
      'What To Learn recommendations',
      'Session history (last 30 days)',
    ],
    cta: 'Sign up with Starter',
    highlighted: false,
    href: '/sign-up',
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For teams running regular debug sessions and daily learning.',
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
    cta: 'Sign up with Professional',
    highlighted: true,
  },
  {
    id: 'bootcamp',
    name: 'Enterprise',
    description: 'Fully managed solutions for bootcamps and teams.',
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
    cta: "Let's chat!",
    highlighted: false,
  },
]

const easeOut = [0, 0, 0.2, 1] as const

interface PricingCardsProps {
  onUpgrade?: (planId: string, billing: 'monthly' | 'yearly') => void
}

export function PricingCards({ onUpgrade }: PricingCardsProps) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.12 })

  return (
    <section className="py-[80px] px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45, ease: easeOut }}
        >
          <h2 className="text-display text-4xl text-[var(--text)] mb-3">Explore all plans</h2>
          <p className="text-[15px] text-[var(--muted)] mb-8">Two plans and a team option. That&apos;s it.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-[4px] border border-[var(--border)] rounded-lg" style={{ background: 'var(--surface)' }}>
            <button
              onClick={() => setBilling('monthly')}
              className="px-4 py-1.5 rounded-md text-[14px] font-medium transition-all duration-200"
              style={{
                background: billing === 'monthly' ? 'var(--accent)' : 'transparent',
                color: billing === 'monthly' ? '#080b14' : 'var(--muted-2)',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className="px-4 py-1.5 rounded-md text-[14px] font-medium transition-all duration-200 flex items-center gap-2"
              style={{
                background: billing === 'yearly' ? 'var(--accent)' : 'transparent',
                color: billing === 'yearly' ? '#080b14' : 'var(--muted-2)',
              }}
            >
              Yearly
              <span className="tag text-[10px]">SAVE 16%</span>
            </button>
          </div>
        </motion.div>

        <div ref={ref} className="grid md:grid-cols-3 gap-5 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.42, delay: i * 0.09, ease: easeOut }}
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: plan.highlighted
                  ? 'linear-gradient(to top, rgba(6, 182, 212, 0.18) 0%, rgba(56, 189, 248, 0.06) 30%, #111827 55%)'
                  : '#111827',
                border: plan.highlighted
                  ? '1px solid rgba(56, 189, 248, 0.3)'
                  : '1px solid #1e293b',
              }}
            >
              {/* Teal glow accent bar at top for Pro */}
              {plan.highlighted && (
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background: 'linear-gradient(90deg, transparent 10%, #38bdf8 50%, transparent 90%)',
                  }}
                />
              )}

              <div className="p-7 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="font-semibold text-[18px] text-[var(--text)]">{plan.name}</h3>
                  {plan.highlighted && (
                    <span
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                      style={{
                        background: 'rgba(56, 189, 248, 0.12)',
                        color: '#7dd3fc',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                      }}
                    >
                      Most Popular
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-4">
                  {plan.id === 'bootcamp' ? (
                    <span className="text-[36px] font-extrabold text-[var(--text)]">Custom</span>
                  ) : (
                    <>
                      <span className="text-[36px] font-extrabold text-[var(--text)]">
                        {plan.price[billing] === 0 ? '₹0' : `₹${plan.price[billing].toLocaleString('en-IN')}`}
                      </span>
                      <span className="text-[var(--muted)] text-[14px] ml-1">/monthly</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-[14px] text-[var(--muted)] mb-6 leading-relaxed">
                  {plan.description}
                </p>

                {/* CTA Button — Filled dark buttons, not gradient */}
                {plan.id === 'free' ? (
                  <Link href={plan.href!} className="block mb-7">
                    <button
                      className="w-full py-2.5 px-5 rounded-full text-[14px] font-medium transition-all duration-200 hover:brightness-110"
                      style={{
                        background: '#1a2235',
                        color: 'var(--text)',
                        border: '1px solid #253247',
                      }}
                    >
                      {plan.cta}
                    </button>
                  </Link>
                ) : plan.id === 'bootcamp' ? (
                  <a href="mailto:hello@debugmate.dev" className="block mb-7">
                    <button
                      className="w-full py-2.5 px-5 rounded-lg text-[14px] font-medium transition-all duration-200"
                      style={{
                        background: '#151d2e',
                        color: 'var(--text)',
                        border: '1px solid #1f2b42',
                      }}
                    >
                      {plan.cta}
                    </button>
                  </a>
                ) : (
                  <div className="mb-7">
                    <button
                      onClick={() => onUpgrade?.(plan.id, billing)}
                      className="w-full py-2.5 px-5 rounded-full text-[14px] font-medium transition-all duration-200"
                      style={{
                        background: 'linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(6,182,212,0.15) 100%)',
                        color: '#e4e8f0',
                        border: '1px solid rgba(56,189,248,0.3)',
                      }}
                    >
                      {plan.cta}
                    </button>
                  </div>
                )}

                {/* Features */}
                <ul className="space-y-3 mt-auto">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[14px] text-[var(--muted)]">
                      <Check className="w-4 h-4 text-[var(--green)] mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
