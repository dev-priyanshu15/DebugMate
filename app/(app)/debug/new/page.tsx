'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CodeEditor } from '@/components/debug/CodeEditor'
import { ClarifyingQuestions } from '@/components/debug/ClarifyingQuestions'
import { DebugReport } from '@/components/debug/DebugReport'
import { useDebugSession } from '@/hooks/useDebugSession'
import { QuestionAnswer, SupportedLanguage } from '@/types'
import { AlertCircle, CheckCircle, MessageCircle, Code2, RefreshCw, AlertTriangle } from 'lucide-react'

const steps = [
  { id: 'input', label: 'Input', icon: Code2, progress: 33 },
  { id: 'clarifying', label: 'Clarify', icon: MessageCircle, progress: 66 },
  { id: 'complete', label: 'Report', icon: CheckCircle, progress: 100 },
]

export default function NewDebugPage() {
  const router = useRouter()
  const {
    step, sessionId, language, code, errorMessage, questions, report,
    isLoading, error, sessionError,
    setStep, setSessionId, setLanguage, setCode, setErrorMessage,
    setQuestions, setReport, setLoading, setError, setSessionError, reset,
  } = useDebugSession()

  const [confettiFired, setConfettiFired] = useState(false)
  const [isRecovering, setIsRecovering] = useState(false)

  const fireConfetti = useCallback(() => {
    import('canvas-confetti').then(m => {
      m.default({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#FF5C7C', '#00d4ff', '#a8ff78'] })
    }).catch(() => {})
  }, [])

  // Reset to input if persisted state is inconsistent (e.g. step=complete but no report)
  useEffect(() => {
    if (step === 'complete' && !report) {
      reset()
    } else if (step === 'clarifying' && questions.length === 0) {
      reset()
    } else if (step === 'generating') {
      reset()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Clear stale errors on mount
  useEffect(() => {
    setError(null)
    setSessionError(null)
  }, [setError, setSessionError])

  const currentStep = steps.find(s => s.id === step) || steps[0]

  // Auto-recover: re-submit code to get a new session, then re-submit answers
  const handleSessionRecovery = async (pendingAnswers?: QuestionAnswer[]) => {
    if (!code.trim() || !errorMessage.trim()) {
      setError('Unable to recover session. Please start a new debug session.')
      setSessionError(null)
      setStep('input')
      return
    }

    setIsRecovering(true)
    setSessionError(null)
    setError(null)

    try {
      // Step 1: Re-create the session
      const startRes = await fetch('/api/debug/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, errorMessage, language }),
      })

      const startData = await startRes.json()

      if (!startRes.ok) {
        setError(startData.error || 'Failed to restore session')
        setStep('input')
        return
      }

      setSessionId(startData.sessionId)
      setQuestions(startData.questions)

      // Step 2: If we have pending answers, auto-submit them
      if (pendingAnswers && pendingAnswers.length > 0) {
        const completeRes = await fetch('/api/debug/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: startData.sessionId, answers: pendingAnswers }),
        })

        const completeData = await completeRes.json()

        if (!completeRes.ok) {
          // Recovery partially succeeded — user can re-answer questions
          setStep('clarifying')
          return
        }

        setReport(completeData.report)
        setStep('complete')
        fireConfetti()
        return
      }

      // No pending answers, go back to clarifying step
      setStep('clarifying')
    } catch {
      setError('Network error during recovery. Please try again.')
      setStep('input')
    } finally {
      setIsRecovering(false)
    }
  }

  const handleAnalyze = async () => {
    if (!code.trim() || !errorMessage.trim()) {
      setError('Please provide both code and error message')
      return
    }

    setLoading(true)
    setError(null)
    setSessionError(null)

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
        // Handle session expiry gracefully
        if (data.code === 'SESSION_NOT_FOUND' && data.recoverable) {
          setSessionError('expired')
          setLoading(false)
          // Auto-recover with the answers
          handleSessionRecovery(answers)
          return
        }
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
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all duration-200 ${
                  isActive ? 'bg-[rgba(239,68,68,0.08)] text-[var(--accent)] border border-[rgba(239,68,68,0.2)]' :
                  isDone ? 'text-[var(--green)]' : 'text-[var(--muted-2)]'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                  {s.label}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px w-8 transition-colors duration-200 ${isDone ? 'bg-[var(--green)]' : 'bg-[var(--border)]'}`} />
                )}
              </div>
            )
          })}
        </div>
        <div className="w-full h-1 bg-[var(--surface-2)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--accent)] rounded-full"
            animate={{ width: `${currentStep.progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Session recovery notice (subtle, not aggressive) */}
      {(sessionError === 'expired' || isRecovering) && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-[rgba(255,214,10,0.06)] border border-[rgba(255,214,10,0.12)] rounded-md flex items-center gap-2.5"
        >
          {isRecovering ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-[#eab308] animate-spin flex-shrink-0" />
              <p className="text-[13px] text-[#eab308]">Restoring your debug session...</p>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-[#eab308] flex-shrink-0" />
              <p className="text-[13px] text-[#eab308]">Session expired — restoring context...</p>
            </>
          )}
        </motion.div>
      )}

      {/* Error message (only for non-session errors) */}
      {error && !sessionError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-[rgba(255,92,124,0.06)] border border-[rgba(255,92,124,0.12)] rounded-md flex items-start gap-2.5"
        >
          <AlertCircle className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[13px] text-[var(--accent)]">{error}</p>
          </div>
        </motion.div>
      )}


      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-5"
          >
            <div>
              <h1 className="text-display text-2xl text-[var(--text)] mb-1.5">Debug Your Code</h1>
              <p className="text-[var(--muted)] text-[13px]">Paste your code and error message to get started</p>
            </div>

            <div className="card p-5">
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
              className="btn-primary w-full justify-center py-2.5 text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="mb-5">
              <h1 className="text-display text-2xl text-[var(--text)] mb-1.5">Your Debug Report</h1>
              <p className="text-[var(--muted)] text-[13px]">Here&apos;s everything you need to fix and understand your bug</p>
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
