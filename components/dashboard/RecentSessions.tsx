'use client'

import { useQuery } from '@tanstack/react-query'
import { SessionCard } from '@/components/debug/SessionCard'
import { SessionCardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Bug, Terminal } from 'lucide-react'
import Link from 'next/link'

async function fetchRecentSessions() {
  const res = await fetch('/api/sessions?pageSize=5')
  if (!res.ok) throw new Error('Failed to fetch sessions')
  return res.json()
}

export function RecentSessions() {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-sessions'],
    queryFn: fetchRecentSessions,
  })

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => <SessionCardSkeleton key={i} />)}
      </div>
    )
  }

  const sessions = data?.data || []

  if (sessions.length === 0) {
    return (
      <div className="card p-10 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-xl bg-[var(--surface-2)] flex items-center justify-center mb-4">
          <Terminal className="w-6 h-6 text-[var(--text-muted)]" />
        </div>
        <h3 className="font-semibold text-base text-[var(--text-primary)] mb-1.5">No debug sessions yet</h3>
        <p className="text-[13px] text-[var(--text-muted)] mb-1 max-w-xs">
          Paste your first error to start learning how DebugMate works.
        </p>
        <p className="text-[11px] text-[var(--text-muted)] mb-5 max-w-xs opacity-60">
          Each session gives you a structured root cause analysis, fix steps, and concepts to study.
        </p>
        <Link href="/debug/new">
          <button className="btn-primary text-[13px]">
            <Bug className="w-3.5 h-3.5" />
            Start Your First Debug
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {sessions.map((session: Parameters<typeof SessionCard>[0]['session']) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  )
}
