'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    sessions: '10/month',
    description: 'Perfect for getting started',
    features: [
      '10 debug sessions/month',
      'Core debug flow',
      'What To Learn card',
      'Last 5 sessions history',
      'Max 5,000 char code',
    ],
    cta: 'Start Free',
    href: '/sign-up',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 199, yearly: 1999 },
    sessions: 'Unlimited',
    description: 'For serious developers',
    features: [
      'Unlimited debug sessions',
      'Full session history forever',
      'Weak spot tracking',
      'Public report sharing',
      'Priority AI processing',
      'Max 10,000 char code',
      'API access',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    id: 'bootcamp',
    name: 'Bootcamp',
    price: { monthly: 2999, yearly: 2999 * 10 },
    sessions: 'Unlimited (50 seats)',
    description: 'For coding schools & teams',
    features: [
      'Everything in Pro',
      '50 student seats',
      'Instructor dashboard',
      'Student analytics',
      'Custom invoice',
      'Priority support',
      'Bulk session management',
    ],
    cta: 'Contact Us',
    highlighted: false,
  },
]

interface PricingCardsProps {
  onUpgrade?: (plan: string, billing: 'monthly' | 'yearly') => void
}

export function PricingCards({ onUpgrade }: PricingCardsProps) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-display text-4xl text-[var(--text-primary)] mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Start free. Upgrade when you&apos;re ready.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-btn">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-1.5 rounded text-sm font-ui transition-all ${
                billing === 'monthly'
                  ? 'bg-[var(--surface-2)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-4 py-1.5 rounded text-sm font-ui transition-all flex items-center gap-1.5 ${
                billing === 'yearly'
                  ? 'bg-[var(--surface-2)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              Yearly
              <span className="badge-green text-xs">Save 16%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`card p-6 flex flex-col relative ${
                plan.highlighted ? 'border-[var(--accent-red)] glow-red' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge-red flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-xl text-[var(--text-primary)] mb-1">{plan.name}</h3>
                <p className="text-xs text-[var(--text-muted)]">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-display text-[var(--text-primary)]">
                    {plan.price[billing] === 0 ? '₹0' : `₹${plan.price[billing].toLocaleString('en-IN')}`}
                  </span>
                  {plan.price[billing] > 0 && (
                    <span className="text-[var(--text-muted)] text-sm mb-1">/{billing === 'monthly' ? 'mo' : 'yr'}</span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">{plan.sessions} sessions</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <Check className="w-4 h-4 text-[var(--accent-green)] flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.id === 'free' ? (
                <Link href={plan.href!}>
                  <button className="btn-secondary w-full justify-center text-sm py-2.5">
                    {plan.cta}
                  </button>
                </Link>
              ) : plan.id === 'bootcamp' ? (
                <a href="mailto:hello@debugmate.dev">
                  <button className="btn-secondary w-full justify-center text-sm py-2.5">
                    {plan.cta}
                  </button>
                </a>
              ) : (
                <button
                  onClick={() => onUpgrade?.(plan.id, billing)}
                  className="btn-primary w-full justify-center text-sm py-2.5"
                >
                  {plan.cta}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
