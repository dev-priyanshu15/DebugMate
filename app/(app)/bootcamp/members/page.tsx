import { Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Bootcamp Members' }

export default function BootcampMembersPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-display text-3xl text-[var(--text-primary)] mb-2">Team Members</h1>
        <p className="text-[var(--text-secondary)] text-sm">View and manage your bootcamp students</p>
      </div>

      <div className="card p-12 text-center">
        <Users className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-4" />
        <h3 className="font-display text-lg text-[var(--text-primary)] mb-2">No members yet</h3>
        <p className="text-sm text-[var(--text-muted)]">
          Share your invite code from the Bootcamp dashboard to add students.
        </p>
      </div>
    </div>
  )
}
