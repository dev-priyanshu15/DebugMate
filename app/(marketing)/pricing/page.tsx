import { PricingCards } from '@/components/marketing/PricingCards'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for DebugMate. Start free, upgrade when ready.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] pt-16">
      <PricingCards />
    </div>
  )
}
