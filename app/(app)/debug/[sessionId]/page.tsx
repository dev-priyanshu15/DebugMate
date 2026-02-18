'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { DebugReport } from '@/components/debug/DebugReport'
import { ReportSkeleton } from '@/components/shared/LoadingSkeleton'
import { DebugSession } from '@/types'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getLanguageIcon, formatDate } from '@/lib/utils'

async function fetchSession(id: string): Promise<DebugSession> {
  const res = await fetch(`/api/sessions/${id}`)
  if (!res.ok) throw new Error('Session not found')
  return res.json()
}

export default function SessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>()

  const { data: session, isLoading, error } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => fetchSession(sessionId),
  })

  if (isLoading) return (
    <div className="max-w-3xl mx-auto">
      <ReportSkeleton />
    </div>
  )

  if (error || !session) return (
    <div className="max-w-3xl mx-auto text-center py-16">
      <p className="text-[var(--text-muted)]">Session not found</p>
      <Link href="/dashboard" className="btn-secondary text-sm mt-4 inline-flex">Back to Dashboard</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard">
          <button className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">{getLanguageIcon(session.language)}</span>
          <div>
            <p className="text-sm font-ui text-[var(--text-primary)]">{session.language}</p>
            <p className="text-xs text-[var(--text-muted)]">{formatDate(session.created_at)}</p>
          </div>
        </div>
      </div>

      {session.debug_report ? (
        <DebugReport
          report={session.debug_report}
          sessionId={session.id}
        />
      ) : (
        <div className="card p-8 text-center">
          <p className="text-[var(--text-muted)]">This session doesn&apos;t have a completed report yet.</p>
        </div>
      )}
    </div>
  )
}
