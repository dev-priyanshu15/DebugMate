import { Users, Copy } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Bootcamp Dashboard' }

export default function BootcampPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-display text-3xl text-[var(--text-primary)] mb-2">Bootcamp Dashboard</h1>
        <p className="text-[var(--text-secondary)] text-sm">Manage your team and track student progress</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Total Students', value: '0', color: 'var(--accent-blue)' },
          { label: 'Sessions This Month', value: '0', color: 'var(--accent-green)' },
          { label: 'Seats Available', value: '50', color: 'var(--accent-yellow)' },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <p className="text-3xl font-display" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-[var(--text-muted)] font-ui mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-[var(--accent-blue)]" />
          <h2 className="font-display text-lg text-[var(--text-primary)]">Invite Students</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Share this invite code with your students to join your bootcamp team.
        </p>
        <div className="flex items-center gap-3 p-3 bg-[var(--surface-2)] rounded-btn border border-[var(--border)]">
          <code className="flex-1 font-mono text-sm text-[var(--accent-blue)]">BOOT-XXXX-XXXX</code>
          <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
            <Copy className="w-3.5 h-3.5" />
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}
