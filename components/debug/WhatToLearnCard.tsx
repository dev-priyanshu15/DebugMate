'use client'

import { useState } from 'react'
import { WhatToLearn, LearnContent } from '@/types'
import { LearnAndQuiz } from './LearnAndQuiz'
import { AiSearch } from './AiSearch'
import { BookOpen, Clock, GraduationCap } from 'lucide-react'

interface WhatToLearnCardProps {
  whatToLearn: WhatToLearn
  language?: string
  bugContext?: string
}

export function WhatToLearnCard({ whatToLearn, language, bugContext }: WhatToLearnCardProps) {
  const [learnContent, setLearnContent] = useState<LearnContent | null>(null)
  const [isLoadingLearn, setIsLoadingLearn] = useState(false)
  const [showLearn, setShowLearn] = useState(false)

  const handleStartLearning = async () => {
    if (learnContent) {
      setShowLearn(true)
      return
    }

    setIsLoadingLearn(true)
    try {
      const res = await fetch('/api/debug/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: whatToLearn.concept,
          whyItMatters: whatToLearn.whyItMatters,
          language: language || 'JavaScript',
          bugContext: bugContext || '',
        }),
      })

      const data = await res.json()
      setLearnContent(data)
      setShowLearn(true)
    } catch {
      console.error('Failed to load learning content')
    } finally {
      setIsLoadingLearn(false)
    }
  }

  return (
    <div className="card p-6 border-l-4 border-l-[var(--accent)]">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen className="w-5 h-5 text-[var(--accent)]" />
        <h3 className="text-display text-lg text-[var(--text)]">What To Learn</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xl font-bold text-[var(--text)] mb-2">{whatToLearn.concept}</p>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed">{whatToLearn.whyItMatters}</p>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-[var(--muted-2)]">
          <Clock className="w-3.5 h-3.5" />
          <span>Estimated learning time: <strong className="text-[var(--text)]">{whatToLearn.estimatedLearningTime}</strong></span>
        </div>

        <button
          onClick={handleStartLearning}
          disabled={isLoadingLearn}
          className="btn-primary text-[13px] py-2 px-4"
        >
          {isLoadingLearn ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Loading lesson...
            </span>
          ) : (
            <>
              <GraduationCap className="w-4 h-4" />
              {showLearn ? 'Back to Lesson' : 'Learn & Take Quiz'}
            </>
          )}
        </button>
      </div>

      {showLearn && learnContent && (
        <div className="mt-6 pt-5 border-t border-[var(--border)]">
          <LearnAndQuiz content={learnContent} />
        </div>
      )}

      {/* In-app AI search */}
      <div className="mt-5 pt-4 border-t border-[var(--border)]">
        <AiSearch
          context={`Concept: ${whatToLearn.concept}. ${whatToLearn.whyItMatters}. Language: ${language || 'JavaScript'}. Bug: ${bugContext || ''}`}
          placeholder={`Ask AI about "${whatToLearn.concept}"...`}
        />
      </div>
    </div>
  )
}
