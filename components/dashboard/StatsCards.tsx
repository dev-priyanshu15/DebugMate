'use client'

import { Bug, CheckCircle, TrendingUp, Clock } from 'lucide-react'

interface StatsCardsProps {
  totalSessions: number
  bugsFixed: number
  currentPlan: string
  streakDays: number
}

const statsConfig = [
  {
    key: 'sessions',
    label: 'Sessions This Month',
    icon: Bug,
    trend: '↗ +3 this week',
    getValue: (p: StatsCardsProps) => String(p.totalSessions),
  },
  {
    key: 'bugs',
    label: 'Bugs Fixed',
    icon: CheckCircle,
    trend: '↗ +12% vs last month',
    getValue: (p: StatsCardsProps) => String(p.bugsFixed),
  },
  {
    key: 'plan',
    label: 'Current Plan',
    icon: TrendingUp,
    trend: null,
    getValue: (p: StatsCardsProps) => p.currentPlan.charAt(0).toUpperCase() + p.currentPlan.slice(1),
  },
  {
    key: 'streak',
    label: 'Debug Streak',
    icon: Clock,
    trend: '↗ 3 days',
    getValue: (p: StatsCardsProps) => (p.streakDays > 0 ? '🔥 Active' : 'Start today'),
  },
]

export function StatsCards(props: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.key} className="card-hover p-5 group">
            <div className="flex items-start justify-between mb-3">
              <Icon className="w-5 h-5 text-[var(--muted)]" />
            </div>
            <p className="text-[22px] font-bold text-[var(--text)] font-mono mb-0.5">
              {stat.getValue(props)}
            </p>
            <p className="text-[12px] text-[var(--muted)] mb-1">{stat.label}</p>
            {stat.trend && (
              <p className="text-[11px] text-[var(--green)]">{stat.trend}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
