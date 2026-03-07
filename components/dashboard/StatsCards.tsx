'use client'

import { useUserData } from '@/hooks/useUser'
import { useQuery } from '@tanstack/react-query'
import { Bug, TrendingUp, Flame, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react'
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
      bg: 'bg-[rgba(255,92,124,0.08)]',
      trend: '+3 this week',
      trendUp: true,
    },
    {
      label: 'Bugs Fixed',
      value: sessions?.total || 0,
      icon: CheckCircle,
      color: 'text-[var(--accent-green)]',
      bg: 'bg-[rgba(168,255,120,0.08)]',
      trend: '+12% vs last month',
      trendUp: true,
    },
    {
      label: 'Current Plan',
      value: (user?.plan || 'free').charAt(0).toUpperCase() + (user?.plan || 'free').slice(1),
      icon: TrendingUp,
      color: 'text-[var(--accent-blue)]',
      bg: 'bg-[rgba(0,212,255,0.08)]',
      trend: null,
      trendUp: null,
    },
    {
      label: 'Debug Streak',
      value: '🔥 Active',
      icon: Flame,
      color: 'text-[var(--accent-yellow)]',
      bg: 'bg-[rgba(255,214,10,0.08)]',
      trend: '3 days',
      trendUp: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="card p-4 transition-all duration-200 hover:border-[var(--border-hover)] hover:-translate-y-0.5 cursor-default"
          >
            <div className={`w-8 h-8 rounded-md ${stat.bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-xl font-display text-[var(--text-primary)]">
              {stat.value}
              {stat.suffix && <span className="text-base text-[var(--text-muted)]">{stat.suffix}</span>}
            </p>
            <p className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5">{stat.label}</p>
            {stat.trend && (
              <div className="flex items-center gap-1 mt-2">
                {stat.trendUp ? (
                  <ArrowUpRight className="w-3 h-3 text-[var(--accent-green)]" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-[var(--accent-red)]" />
                )}
                <span className={`text-[10px] font-medium ${stat.trendUp ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                  {stat.trend}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
