import Link from 'next/link'
import { DebugSession } from '@/types'
import { getLanguageIcon, formatRelativeTime, truncateText } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface SessionCardProps {
  session: Partial<DebugSession> & {
    id: string
    language: string
    error_message: string
    status: string
    created_at: string
  }
}

const statusConfig = {
  complete: { label: 'Complete', className: 'badge-green' },
  clarifying: { label: 'In Progress', className: 'badge-yellow' },
  pending: { label: 'Pending', className: 'badge-yellow' },
  failed: { label: 'Failed', className: 'badge-red' },
}

export function SessionCard({ session }: SessionCardProps) {
  const status = statusConfig[session.status as keyof typeof statusConfig] || statusConfig.pending

  return (
    <Link href={`/debug/${session.id}`}>
      <div className="card-hover p-4 flex items-center gap-4 cursor-pointer">
        <div className="w-10 h-10 rounded-btn bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-xl flex-shrink-0">
          {getLanguageIcon(session.language)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-ui text-[var(--text-primary)] truncate">
            {truncateText(session.error_message, 80)}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {session.language} · {formatRelativeTime(session.created_at)}
          </p>
        </div>
        <span className={cn('badge flex-shrink-0', status.className)}>
          {status.label}
        </span>
      </div>
    </Link>
  )
}
