'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { WeakSpot } from '@/types'
import { Skeleton } from '@/components/shared/LoadingSkeleton'

interface WeakSpotChartProps {
  data: WeakSpot[]
  isLoading?: boolean
}

const COLORS = [
  'var(--accent-red)',
  'var(--accent-blue)',
  'var(--accent-yellow)',
  'var(--accent-green)',
  '#c084fc',
]

export function WeakSpotChart({ data, isLoading }: WeakSpotChartProps) {
  if (isLoading) {
    return <Skeleton className="h-48 w-full" />
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center">
        <p className="text-sm text-[var(--text-muted)]">No weak spots tracked yet</p>
      </div>
    )
  }

  const chartData = data
    .sort((a, b) => b.occurrence_count - a.occurrence_count)
    .slice(0, 5)
    .map((ws) => ({
      name: ws.error_category.length > 15 ? ws.error_category.slice(0, 15) + '...' : ws.error_category,
      count: ws.occurrence_count,
      fullName: ws.error_category,
    }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'DM Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontFamily: 'Syne',
            fontSize: '12px',
          }}
          formatter={(value, name, props) => [value, props.payload.fullName]}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
