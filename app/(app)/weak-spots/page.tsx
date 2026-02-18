'use client'

import { useWeakSpots } from '@/hooks/useWeakSpots'
import { WeakSpotChart } from '@/components/dashboard/WeakSpotChart'
import { getLanguageIcon, formatRelativeTime } from '@/lib/utils'
import { TrendingUp, Search } from 'lucide-react'
import type { Metadata } from 'next'

export default function WeakSpotsPage() {
  const { data: weakSpots, isLoading } = useWeakSpots()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-display text-3xl text-[var(--text-primary)] mb-2">Your Weak Spots</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Track recurring error patterns and see where to focus your learning
        </p>
      </div>

      {/* Chart */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-[var(--accent-blue)]" />
          <h2 className="font-display text-lg text-[var(--text-primary)]">Top Error Categories</h2>
        </div>
        <WeakSpotChart data={weakSpots || []} isLoading={isLoading} />
      </div>

      {/* Weak spot list */}
      <div className="space-y-3">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="card p-4 skeleton h-20" />
          ))
        ) : weakSpots && weakSpots.length > 0 ? (
          weakSpots
            .sort((a, b) => b.occurrence_count - a.occurrence_count)
            .map((ws) => (
              <div key={ws.id} className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-btn bg-[var(--surface-2)] flex items-center justify-center text-xl flex-shrink-0">
                  {getLanguageIcon(ws.language)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-ui text-sm text-[var(--text-primary)]">{ws.error_category}</h3>
                    <span className="badge-red text-xs">{ws.occurrence_count}x</span>
                  </div>
                  {ws.related_concept && (
                    <p className="text-xs text-[var(--text-muted)] mb-2">
                      Related concept: <span className="text-[var(--accent-blue)]">{ws.related_concept}</span>
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[var(--text-muted)]">
                      Last seen {formatRelativeTime(ws.last_seen_at)}
                    </p>
                    <button
                      onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(ws.error_category + ' ' + ws.language)}`, '_blank')}
                      className="flex items-center gap-1 text-xs text-[var(--accent-blue)] hover:underline"
                    >
                      <Search className="w-3 h-3" />
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="card p-12 text-center">
            <TrendingUp className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className="font-display text-lg text-[var(--text-primary)] mb-2">No weak spots yet</h3>
            <p className="text-sm text-[var(--text-muted)]">
              Complete debug sessions to start tracking your error patterns.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
