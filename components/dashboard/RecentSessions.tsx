'use client'

import Link from 'next/link'
import { DebugSession } from '@/types'
import { Clock, ArrowRight, Code2 } from 'lucide-react'

interface RecentSessionsProps {
  sessions: DebugSession[]
  isLoading: boolean
}

export function RecentSessions({ sessions, isLoading }: RecentSessionsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-4">
            <div className="skeleton h-4 w-3/4 mb-2" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="card p-10 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-lg bg-[var(--surface-2)] flex items-center justify-center mb-4">
          <Code2 className="w-6 h-6 text-[var(--muted-2)]" />
        </div>
        <h3 className="text-[15px] font-bold text-[var(--text)] mb-1.5">No debug sessions yet</h3>
        <p className="text-[13px] text-[var(--muted)] mb-1">
          Paste your first error to start learning how DebugMate works.
        </p>
        <p className="text-[12px] text-[var(--muted-2)] mb-5">
          Each session gives you a structured root cause analysis, fix steps, and concepts to study.
        </p>
        <Link href="/debug/new">
          <button className="btn-primary text-[13px]">
            <Bug className="w-4 h-4" />
            Start Your First Debug
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {sessions.map((session) => (
        <Link key={session.id} href={`/debug/${session.id}`}>
          <div className="card-hover p-4 flex items-center justify-between group cursor-pointer">
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[var(--text)] truncate">
                {session.error_message.substring(0, 80)}
                {session.error_message.length > 80 && '...'}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] text-[var(--muted-2)] uppercase tracking-wider">{session.language}</span>
                <span className="flex items-center gap-1 text-[11px] text-[var(--muted-2)]">
                  <Clock className="w-3 h-3" />
                  {new Date(session.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--muted-2)] group-hover:text-[var(--accent)] transition-colors duration-150 flex-shrink-0 ml-3" />
          </div>
        </Link>
      ))}
    </div>
  )
}

function Bug(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
    </svg>
  )
}
