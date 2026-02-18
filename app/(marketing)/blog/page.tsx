import type { Metadata } from 'next'
import { BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Debugging tips, tutorials, and insights from the DebugMate team.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-7 h-7 text-[var(--text-muted)]" />
        </div>
        <h1 className="text-display text-4xl text-[var(--text-primary)] mb-4">Blog Coming Soon</h1>
        <p className="text-[var(--text-secondary)]">
          We&apos;re writing debugging guides, tutorials, and build-in-public posts. Check back soon!
        </p>
      </div>
    </div>
  )
}
