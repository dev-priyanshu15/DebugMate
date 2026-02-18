import { WhatToLearn } from '@/types'
import { BookOpen, Clock, Search } from 'lucide-react'

interface WhatToLearnCardProps {
  whatToLearn: WhatToLearn
}

export function WhatToLearnCard({ whatToLearn }: WhatToLearnCardProps) {
  const handleSearch = () => {
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(whatToLearn.searchQuery)}`,
      '_blank'
    )
  }

  return (
    <div className="card p-6 border-l-4 border-l-[var(--accent-blue)]">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen className="w-5 h-5 text-[var(--accent-blue)]" />
        <h3 className="font-display text-lg text-[var(--text-primary)]">What To Learn</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xl font-ui text-[var(--accent-blue)] mb-2">{whatToLearn.concept}</p>
          <p className="text-[var(--text-secondary)] leading-relaxed">{whatToLearn.whyItMatters}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Clock className="w-4 h-4" />
          <span>Estimated learning time: <strong className="text-[var(--text-secondary)]">{whatToLearn.estimatedLearningTime}</strong></span>
        </div>

        <button
          onClick={handleSearch}
          className="flex items-center gap-2 px-4 py-2.5 rounded-btn bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent-blue)] transition-colors text-sm font-ui text-[var(--text-secondary)] hover:text-[var(--accent-blue)]"
        >
          <Search className="w-4 h-4" />
          Search: &quot;{whatToLearn.searchQuery}&quot;
        </button>
      </div>
    </div>
  )
}
