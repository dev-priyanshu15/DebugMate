import { currentUser } from '@clerk/nextjs/server'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { RecentSessions } from '@/components/dashboard/RecentSessions'
import Link from 'next/link'
import { ArrowRight, Bug } from 'lucide-react'
import type { Metadata } from 'next'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await currentUser()

  let totalSessions = 0
  let bugsFixed = 0
  let currentPlan = 'free'
  let streakDays = 0
  let sessions: any[] = []

  try {
    const supabase = getSupabaseServerClient()

    // Get user from DB
    const { data: dbUser } = await supabase
      .from('users')
      .select('id, plan')
      .eq('clerk_id', user?.id || '')
      .single()

    if (dbUser) {
      currentPlan = dbUser.plan || 'free'

      // Fetch recent sessions
      const { data: dbSessions, count } = await supabase
        .from('debug_sessions')
        .select('id, language, error_message, status, created_at, debug_report', { count: 'exact' })
        .eq('user_id', dbUser.id)
        .order('created_at', { ascending: false })
        .limit(10)

      sessions = dbSessions || []
      totalSessions = count || sessions.length

      // Count completed sessions as bugs fixed
      bugsFixed = sessions.filter(s => s.status === 'complete').length

      // Calculate streak — consecutive days with sessions
      if (sessions.length > 0) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        let streak = 0
        let checkDate = new Date(today)

        for (let d = 0; d < 30; d++) {
          const dayStr = checkDate.toISOString().split('T')[0]
          const hasSession = sessions.some(s => {
            const sessionDate = new Date(s.created_at).toISOString().split('T')[0]
            return sessionDate === dayStr
          })
          if (hasSession) {
            streak++
            checkDate.setDate(checkDate.getDate() - 1)
          } else if (d === 0) {
            // Today has no session, check yesterday
            checkDate.setDate(checkDate.getDate() - 1)
          } else {
            break
          }
        }
        streakDays = streak
      }
    }
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
    // Show page with defaults if DB fails
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display text-2xl text-[var(--text)]">
            Welcome back, {user?.firstName || 'Developer'} 👋
          </h1>
          <p className="text-[var(--muted)] text-[13px] mt-0.5">
            Ready to debug smarter today?
          </p>
        </div>
        <Link href="/debug/new">
          <button className="btn-primary text-[13px] flex items-center gap-2">
            <Bug className="w-4 h-4" />
            New Debug Session
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Stats */}
      <StatsCards
        totalSessions={totalSessions}
        bugsFixed={bugsFixed}
        currentPlan={currentPlan}
        streakDays={streakDays}
      />

      {/* Recent Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-display text-xl text-[var(--text)]">Recent Sessions</h2>
          <Link href="/debug/new" className="text-[13px] text-[var(--accent)] hover:underline">
            View all →
          </Link>
        </div>
        <RecentSessions sessions={sessions} isLoading={false} />
      </div>
    </div>
  )
}
