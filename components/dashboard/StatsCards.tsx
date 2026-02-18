'use client'

import { useUserData } from '@/hooks/useUser'
import { useQuery } from '@tanstack/react-query'
import { Bug, TrendingUp, Flame, CheckCircle } from 'lucide-react'
import { StatCardSkeleton } from '@/components/shared/LoadingSkeleton'

async function fetchSessions() {
  const res = await fetch('/api/sessions?pageSize=100')
  if (!res.ok) return { total: 0 }
  return res.json()
}

export function StatsCards() {
  const { data: user, isLoading: userLoading } = useUserData()
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions-stats'],
    queryFn: fetchSessions,
  })

  if (userLoading || sessionsLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    )
  }

  const stats = [
    {
      label: 'Sessions This Month',
      value: user?.sessions_used || 0,
      suffix: user?.plan === 'free' ? `/${user?.sessions_limit}` : '',
      icon: Bug,
      color: 'text-[var(--accent-red)]',
      bg: 'bg-[rgba(255,77,109,0.1)]',
    },
    {
      label: 'Bugs Fixed',
      value: sessions?.total || 0,
      icon: CheckCircle,
      color: 'text-[var(--accent-green)]',
      bg: 'bg-[rgba(168,255,120,0.1)]',
    },
    {
      label: 'Current Plan',
      value: (user?.plan || 'free').charAt(0).toUpperCase() + (user?.plan || 'free').slice(1),
      icon: TrendingUp,
      color: 'text-[var(--accent-blue)]',
      bg: 'bg-[rgba(0,212,255,0.1)]',
    },
    {
      label: 'Debug Streak',
      value: '🔥 Active',
      icon: Flame,
      color: 'text-[var(--accent-yellow)]',
      bg: 'bg-[rgba(255,214,10,0.1)]',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="card p-5">
            <div className={`w-9 h-9 rounded-btn ${stat.bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-display text-[var(--text-primary)]">
              {stat.value}
              {stat.suffix && <span className="text-lg text-[var(--text-muted)]">{stat.suffix}</span>}
            </p>
            <p className="text-xs text-[var(--text-muted)] font-ui mt-1">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
