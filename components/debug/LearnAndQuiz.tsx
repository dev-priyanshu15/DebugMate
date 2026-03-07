'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LearnContent, QuizQuestion } from '@/types'
import { BookOpen, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react'

interface LearnAndQuizProps {
  content: LearnContent
}

function QuizSection({ questions, onComplete }: { questions: QuizQuestion[]; onComplete: (score: number) => void }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<boolean[]>([])

  const q = questions[currentQ]
  const isLast = currentQ === questions.length - 1
  const isCorrect = selected === q.correctIndex

  const handleSelect = (idx: number) => {
    if (showExplanation) return // already answered
    setSelected(idx)
    setShowExplanation(true)
    if (idx === q.correctIndex) {
      setScore(s => s + 1)
    }
    setAnswered(prev => [...prev, idx === q.correctIndex])
  }

  const handleNext = () => {
    if (isLast) {
      const finalScore = score
      onComplete(finalScore)
      return
    }
    setCurrentQ(c => c + 1)
    setSelected(null)
    setShowExplanation(false)
  }

  return (
    <div>
      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mb-5">
        {questions.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i < currentQ
                ? (answered[i] ? 'var(--green)' : 'var(--accent)')
                : i === currentQ ? 'var(--accent)' : 'var(--border)',
            }}
          />
        ))}
      </div>

      <p className="text-[11px] text-[var(--muted-2)] uppercase tracking-wider mb-3">
        Question {currentQ + 1} of {questions.length}
      </p>

      <p className="text-[15px] font-bold text-[var(--text)] mb-4 leading-snug">{q.question}</p>

      <div className="space-y-2 mb-4">
        {q.options.map((opt, i) => {
          let borderColor = 'var(--border)'
          let bg = 'transparent'
          if (showExplanation) {
            if (i === q.correctIndex) {
              borderColor = 'var(--green)'
              bg = 'rgba(34, 197, 94, 0.06)'
            } else if (i === selected && !isCorrect) {
              borderColor = 'var(--accent)'
              bg = 'rgba(239, 68, 68, 0.06)'
            }
          } else if (i === selected) {
            borderColor = 'var(--accent)'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showExplanation}
              className="w-full text-left p-3 rounded-lg border text-[13px] transition-all duration-200 flex items-start gap-2.5"
              style={{ borderColor, background: bg }}
            >
              <span className="text-[11px] font-bold text-[var(--muted-2)] mt-px w-4 flex-shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-[var(--text)] flex-1">{opt}</span>
              {showExplanation && i === q.correctIndex && (
                <CheckCircle className="w-4 h-4 text-[var(--green)] flex-shrink-0 mt-0.5" />
              )}
              {showExplanation && i === selected && !isCorrect && i !== q.correctIndex && (
                <XCircle className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
              )}
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div
              className="p-3 rounded-lg border text-[13px] text-[var(--muted)] leading-relaxed"
              style={{
                borderColor: isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                background: isCorrect ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
              }}
            >
              <p className="font-bold text-[12px] mb-1" style={{ color: isCorrect ? 'var(--green)' : 'var(--accent)' }}>
                {isCorrect ? '✓ Correct' : '✗ Not quite'}
              </p>
              {q.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showExplanation && (
        <button onClick={handleNext} className="btn-primary text-[13px]">
          {isLast ? 'See Results' : 'Next Question'}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

function ScoreCard({ score, total, onRetry }: { score: number; total: number; onRetry: () => void }) {
  const pct = Math.round((score / total) * 100)
  const passed = pct >= 60

  return (
    <div className="text-center py-4">
      <div className="mb-4">
        <Trophy className={`w-10 h-10 mx-auto mb-3 ${passed ? 'text-[var(--green)]' : 'text-[var(--accent)]'}`} />
        <p className="text-[36px] font-bold font-mono text-[var(--text)]">{score}/{total}</p>
        <p className="text-[13px] text-[var(--muted)] mt-1">
          {passed ? 'You get it. This concept should stick.' : 'Worth reviewing the lesson and trying again.'}
        </p>
      </div>
      {!passed && (
        <button onClick={onRetry} className="btn-secondary text-[13px]">
          <RotateCcw className="w-3.5 h-3.5" />
          Try Again
        </button>
      )}
    </div>
  )
}

export function LearnAndQuiz({ content }: LearnAndQuizProps) {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'score'>('learn')
  const [finalScore, setFinalScore] = useState(0)

  const handleQuizComplete = (score: number) => {
    setFinalScore(score)
    setPhase('score')
  }

  const handleRetry = () => {
    setPhase('quiz')
  }

  return (
    <div className="space-y-5">
      {/* Phase tabs */}
      <div className="flex gap-1 p-[3px] border border-[var(--border)] rounded-md w-fit" style={{ background: 'var(--surface)' }}>
        <button
          onClick={() => setPhase('learn')}
          className="px-3 py-1 rounded text-[12px] font-medium transition-all duration-200"
          style={{
            background: phase === 'learn' ? 'var(--accent)' : 'transparent',
            color: phase === 'learn' ? 'white' : 'var(--muted-2)',
          }}
        >
          Learn
        </button>
        <button
          onClick={() => setPhase('quiz')}
          className="px-3 py-1 rounded text-[12px] font-medium transition-all duration-200"
          style={{
            background: phase === 'quiz' ? 'var(--accent)' : 'transparent',
            color: phase === 'quiz' ? 'white' : 'var(--muted-2)',
          }}
        >
          Quiz
        </button>
        {finalScore > 0 && (
          <button
            onClick={() => setPhase('score')}
            className="px-3 py-1 rounded text-[12px] font-medium transition-all duration-200"
            style={{
              background: phase === 'score' ? 'var(--accent)' : 'transparent',
              color: phase === 'score' ? 'white' : 'var(--muted-2)',
            }}
          >
            Score
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'learn' && (
          <motion.div
            key="learn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Lesson paragraphs */}
            {content.lesson.map((para, i) => (
              <p key={i} className="text-[13px] text-[var(--muted)] leading-relaxed">{para}</p>
            ))}

            {/* Code examples */}
            {content.codeExamples && content.codeExamples.length > 0 && (
              <div className="space-y-3">
                {content.codeExamples.map((ex, i) => (
                  <div key={i}>
                    <p className="text-[11px] font-bold text-[var(--muted-2)] uppercase tracking-wider mb-1.5">{ex.label}</p>
                    <pre
                      className="p-3 rounded-lg text-[12px] font-mono leading-relaxed overflow-x-auto"
                      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    >
                      <code>{ex.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}

            {/* Key takeaways */}
            {content.keyTakeaways && content.keyTakeaways.length > 0 && (
              <div className="p-3 rounded-lg border border-[var(--border)]" style={{ background: 'rgba(34,197,94,0.03)' }}>
                <p className="text-[11px] font-bold text-[var(--green)] uppercase tracking-wider mb-2">Key takeaways</p>
                <ul className="space-y-1.5">
                  {content.keyTakeaways.map((t, i) => (
                    <li key={i} className="text-[13px] text-[var(--muted)] flex items-start gap-2">
                      <span className="text-[var(--green)] mt-0.5">→</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={() => setPhase('quiz')} className="btn-primary text-[13px]">
              Take the quiz
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {phase === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <QuizSection questions={content.quiz} onComplete={handleQuizComplete} />
          </motion.div>
        )}

        {phase === 'score' && (
          <motion.div
            key="score"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <ScoreCard score={finalScore} total={content.quiz.length} onRetry={handleRetry} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
