'use client'

import { useQuery } from '@tanstack/react-query'
import { SessionCard } from '@/components/debug/SessionCard'
import { SessionCardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Bug } from 'lucide-react'
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
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => <SessionCardSkeleton key={i} />)}
      </div>
    )
  }

  const sessions = data?.data || []

  if (sessions.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-4">
          <Bug className="w-7 h-7 text-[var(--text-muted)]" />
        </div>
        <h3 className="font-display text-lg text-[var(--text-primary)] mb-2">No debug sessions yet</h3>
        <p className="text-sm text-[var(--text-muted)] mb-6 max-w-xs">
          Start your first debug session to see your history here.
        </p>
        <Link href="/debug/new">
          <button className="btn-primary text-sm">Start Debugging →</button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sessions.map((session: Parameters<typeof SessionCard>[0]['session']) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  )
}
