'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CodeEditor } from '@/components/debug/CodeEditor'
import { ClarifyingQuestions } from '@/components/debug/ClarifyingQuestions'
import { DebugReport } from '@/components/debug/DebugReport'
import { useDebugSession } from '@/hooks/useDebugSession'
import { QuestionAnswer, SupportedLanguage } from '@/types'
import { AlertCircle, CheckCircle, MessageCircle, Code2 } from 'lucide-react'

const steps = [
  { id: 'input', label: 'Input', icon: Code2, progress: 33 },
  { id: 'clarifying', label: 'Clarify', icon: MessageCircle, progress: 66 },
  { id: 'complete', label: 'Report', icon: CheckCircle, progress: 100 },
]

export default function NewDebugPage() {
  const router = useRouter()
  const {
    step, sessionId, language, code, errorMessage, questions, report,
    isLoading, error,
    setStep, setSessionId, setLanguage, setCode, setErrorMessage,
    setQuestions, setReport, setLoading, setError, reset,
  } = useDebugSession()

  const [confettiFired, setConfettiFired] = useState(false)

  const fireConfetti = useCallback(() => {
    import('canvas-confetti').then(m => {
      m.default({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#ff4d6d', '#00d4ff', '#a8ff78'] })
    }).catch(() => {})
  }, [])

  // Clear stale errors from previous sessions on mount
  useEffect(() => {
    setError(null)
  }, [setError])

  const currentStep = steps.find(s => s.id === step) || steps[0]

  const handleAnalyze = async () => {
    if (!code.trim() || !errorMessage.trim()) {
      setError('Please provide both code and error message')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/debug/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, errorMessage, language }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 403 && data.code === 'LIMIT_REACHED') {
          setError('Monthly session limit reached. Please upgrade to Pro for unlimited sessions.')
        } else {
          setError(data.error || 'Failed to analyze code')
        }
        return
      }

      setSessionId(data.sessionId)
      setQuestions(data.questions)
      setStep('clarifying')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswers = async (answers: QuestionAnswer[]) => {
    if (!sessionId) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/debug/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, answers }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to generate report')
        return
      }

      setReport(data.report)
      setStep('complete')
      setConfettiFired(true)
      fireConfetti()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    reset()
    setConfettiFired(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          {steps.map((s, i) => {
            const Icon = s.icon
            const isActive = s.id === step
            const isDone = steps.findIndex(x => x.id === step) > i
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-ui transition-all ${
                  isActive ? 'bg-[rgba(255,77,109,0.1)] text-[var(--accent-red)] border border-[rgba(255,77,109,0.3)]' :
                  isDone ? 'text-[var(--accent-green)]' : 'text-[var(--text-muted)]'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                  {s.label}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px w-8 ${isDone ? 'bg-[var(--accent-green)]' : 'bg-[var(--border)]'}`} />
                )}
              </div>
            )
          })}
        </div>
        <div className="w-full h-1 bg-[var(--surface-2)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--accent-red)] to-[var(--accent-blue)] rounded-full"
            animate={{ width: `${currentStep.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-[rgba(255,77,109,0.1)] border border-[rgba(255,77,109,0.3)] rounded-btn flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[var(--accent-red)] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--accent-red)]">{error}</p>
        </div>
      )}


      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-display text-3xl text-[var(--text-primary)] mb-2">Debug Your Code</h1>
              <p className="text-[var(--text-secondary)] text-sm">Paste your code and error message to get started</p>
            </div>

            <div className="card p-6">
              <CodeEditor
                language={language}
                code={code}
                errorMessage={errorMessage}
                onLanguageChange={(lang: SupportedLanguage) => setLanguage(lang)}
                onCodeChange={setCode}
                onErrorMessageChange={setErrorMessage}
              />
            </div>

            <motion.button
              onClick={handleAnalyze}
              disabled={isLoading || !code.trim() || !errorMessage.trim()}
              whileHover={!isLoading ? { scale: 1.01 } : {}}
              whileTap={!isLoading ? { scale: 0.99 } : {}}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  DebugMate is reading your code...
                </span>
              ) : (
                'Analyze My Bug →'
              )}
            </motion.button>
          </motion.div>
        )}

        {step === 'clarifying' && questions.length > 0 && (
          <motion.div
            key="clarifying"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <ClarifyingQuestions
              questions={questions}
              onSubmit={handleAnswers}
              isLoading={isLoading}
            />
          </motion.div>
        )}

        {step === 'complete' && report && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <div className="mb-6">
              <h1 className="text-display text-3xl text-[var(--text-primary)] mb-2">Your Debug Report</h1>
              <p className="text-[var(--text-secondary)] text-sm">Here&apos;s everything you need to fix and understand your bug</p>
            </div>
            <DebugReport
              report={report}
              sessionId={sessionId || ''}
              onDebugAnother={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
