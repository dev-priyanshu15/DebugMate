import { currentUser } from '@clerk/nextjs/server'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { RecentSessions } from '@/components/dashboard/RecentSessions'
import Link from 'next/link'
import { ArrowRight, Bug } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const user = await currentUser()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display text-3xl text-[var(--text-primary)]">
            Welcome back, {user?.firstName || 'Developer'} 👋
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Ready to debug smarter today?
          </p>
        </div>
        <Link href="/debug/new">
          <button className="btn-primary text-sm flex items-center gap-2">
            <Bug className="w-4 h-4" />
            New Debug Session
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Recent Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-[var(--text-primary)]">Recent Sessions</h2>
          <Link href="/debug/new" className="text-sm text-[var(--accent-blue)] hover:underline font-ui">
            View all →
          </Link>
        </div>
        <RecentSessions />
      </div>
    </div>
  )
}
