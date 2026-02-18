'use client'

import { useState } from 'react'
import { useUserData } from '@/hooks/useUser'
import { CreditCard, Zap, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

export default function BillingPage() {
  const { data: user, isLoading } = useUserData()
  const [upgrading, setUpgrading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgrade = async (plan: 'pro' | 'bootcamp', billing: 'monthly' | 'yearly') => {
    setUpgrading(true)
    setError(null)

    try {
      const res = await fetch('/api/billing/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billing }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)

      script.onload = () => {
        const rzp = new window.Razorpay({
          key: data.keyId,
          subscription_id: data.subscriptionId,
          name: 'DebugMate',
          description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
          prefill: { email: data.email },
          theme: { color: '#ff4d6d' },
          handler: () => {
            window.location.reload()
          },
        })
        rzp.open()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start upgrade')
    } finally {
      setUpgrading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel? Your plan stays active until the end of the billing period.')) return

    const res = await fetch('/api/billing/cancel-subscription', { method: 'POST' })
    if (res.ok) {
      window.location.reload()
    }
  }

  const sessionsUsed = user?.sessions_used || 0
  const sessionsLimit = user?.sessions_limit || 10
  const usagePercent = Math.min((sessionsUsed / sessionsLimit) * 100, 100)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-display text-3xl text-[var(--text-primary)] mb-2">Billing</h1>
        <p className="text-[var(--text-secondary)] text-sm">Manage your subscription and usage</p>
      </div>

      {error && (
        <div className="p-4 bg-[rgba(255,77,109,0.1)] border border-[rgba(255,77,109,0.3)] rounded-btn flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-[var(--accent-red)]" />
          <p className="text-sm text-[var(--accent-red)]">{error}</p>
        </div>
      )}

      {/* Current plan */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-[var(--accent-blue)]" />
          <h2 className="font-display text-lg text-[var(--text-primary)]">Current Plan</h2>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-2xl font-display text-[var(--text-primary)] capitalize">
              {user?.plan || 'Free'}
            </p>
            {user?.subscription_status === 'cancelled' && (
              <p className="text-xs text-[var(--accent-yellow)] mt-1">
                Cancels at period end
              </p>
            )}
          </div>
          {user?.plan !== 'free' && (
            <span className="badge-blue">Active</span>
          )}
        </div>

        {/* Usage */}
        {user?.plan === 'free' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)] font-ui">Sessions this month</span>
              <span className="text-[var(--text-primary)] font-ui">{sessionsUsed}/{sessionsLimit}</span>
            </div>
            <div className="w-full h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${usagePercent >= 80 ? 'bg-[var(--accent-red)]' : 'bg-[var(--accent-blue)]'}`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            {usagePercent >= 80 && (
              <p className="text-xs text-[var(--accent-yellow)]">
                ⚠️ You&apos;re running low on sessions
              </p>
            )}
          </div>
        )}
      </div>

      {/* Upgrade options */}
      {user?.plan === 'free' && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-4 h-4 text-[var(--accent-yellow)]" />
            <h2 className="font-display text-lg text-[var(--text-primary)]">Upgrade</h2>
          </div>

          <div className="grid gap-4">
            <div className="p-4 bg-[var(--surface-2)] rounded-btn border border-[var(--border)] hover:border-[var(--accent-red)] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-ui text-[var(--text-primary)]">Pro</p>
                  <p className="text-2xl font-display text-[var(--text-primary)]">₹199<span className="text-sm text-[var(--text-muted)]">/mo</span></p>
                </div>
                <button
                  onClick={() => handleUpgrade('pro', 'monthly')}
                  disabled={upgrading}
                  className="btn-primary text-sm"
                >
                  {upgrading ? 'Loading...' : 'Upgrade'}
                </button>
              </div>
              <ul className="space-y-1.5">
                {['Unlimited sessions', 'Full history', 'Weak spot tracking', 'Public sharing'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <CheckCircle className="w-3.5 h-3.5 text-[var(--accent-green)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Cancel subscription */}
      {user?.plan !== 'free' && user?.subscription_status !== 'cancelled' && (
        <div className="card p-6">
          <h2 className="font-display text-lg text-[var(--text-primary)] mb-2">Cancel Subscription</h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Your plan stays active until the end of the current billing period.
          </p>
          <button onClick={handleCancel} className="btn-secondary text-sm text-[var(--accent-red)]">
            Cancel Subscription
          </button>
        </div>
      )}
    </div>
  )
}
