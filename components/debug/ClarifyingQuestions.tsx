'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClarifyingQuestion, QuestionAnswer } from '@/types'
import { MessageCircle } from 'lucide-react'

interface ClarifyingQuestionsProps {
  questions: ClarifyingQuestion[]
  onSubmit: (answers: QuestionAnswer[]) => void
  isLoading: boolean
}

export function ClarifyingQuestions({
  questions,
  onSubmit,
  isLoading,
}: ClarifyingQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(questions.map((q) => [q.id, '']))
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formattedAnswers: QuestionAnswer[] = questions.map((q) => ({
      questionId: q.id,
      answer: answers[q.id] || '',
    }))
    onSubmit(formattedAnswers)
  }

  const allAnswered = questions.every((q) => (answers[q.id] || '').trim().length > 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 badge-blue mb-3">
          <MessageCircle className="w-3.5 h-3.5" />
          3 Quick Questions
        </div>
        <h2 className="text-2xl font-display text-[var(--text-primary)]">
          Before I diagnose, I have 3 questions
        </h2>
        <p className="text-[var(--text-secondary)] mt-2 text-sm">
          Your answers help me pinpoint the exact root cause
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-5"
          >
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent-red)] to-[#ff6b8a] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-display text-white">{index + 1}</span>
              </div>
              <div className="flex-1">
                <p className="text-[var(--text-primary)] font-ui text-sm mb-3">
                  {question.question}
                </p>
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
                  }
                  placeholder="Your answer..."
                  rows={2}
                  maxLength={500}
                  className="input-field resize-none text-sm"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-[var(--text-muted)]">
                    {(answers[question.id] || '').length}/500
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        type="submit"
        disabled={!allAnswered || isLoading}
        whileHover={allAnswered && !isLoading ? { scale: 1.01 } : {}}
        whileTap={allAnswered && !isLoading ? { scale: 0.99 } : {}}
        className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating your debug report...
          </span>
        ) : (
          'Get My Debug Report →'
        )}
      </motion.button>
    </form>
  )
}
