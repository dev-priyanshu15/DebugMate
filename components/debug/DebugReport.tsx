'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DebugReport as DebugReportType } from '@/types'
import { WhatToLearnCard } from './WhatToLearnCard'
import { copyToClipboard, getSeverityColor } from '@/lib/utils'
import {
  AlertTriangle,
  CheckCircle,
  Code2,
  BookOpen,
  Lightbulb,
  Heart,
  Copy,
  Check,
  Download,
} from 'lucide-react'

interface DebugReportProps {
  report: DebugReportType
  sessionId: string
  onShareReport?: () => void
  onDebugAnother?: () => void
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre className="code-block text-sm overflow-x-auto">{code}</pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded bg-[var(--surface-2)] border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-[var(--accent-green)]" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        )}
      </button>
    </div>
  )
}

export function DebugReport({ report, sessionId, onShareReport, onDebugAnother }: DebugReportProps) {
  const [copiedFixed, setCopiedFixed] = useState(false)

  const handleCopyFixed = async () => {
    await copyToClipboard(report.fixedCode)
    setCopiedFixed(true)
    setTimeout(() => setCopiedFixed(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([report.fixedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fixed-code.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Root Cause */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 border-l-4 border-l-[var(--accent-red)]"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--accent-red)]" />
            <h3 className="font-display text-lg text-[var(--text-primary)]">Root Cause</h3>
          </div>
          <span className={`badge ${
            report.rootCause.severity === 'high' ? 'badge-red' :
            report.rootCause.severity === 'medium' ? 'badge-yellow' : 'badge-green'
          }`}>
            {report.rootCause.severity} severity
          </span>
        </div>
        <p className="text-xl font-ui text-[var(--text-primary)] mb-3">{report.rootCause.summary}</p>
        <p className="text-[var(--text-secondary)] leading-relaxed">{report.rootCause.explanation}</p>
      </motion.div>

      {/* Step-by-Step Fix */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6 border-l-4 border-l-[var(--accent-green)]"
      >
        <div className="flex items-center gap-2 mb-5">
          <CheckCircle className="w-5 h-5 text-[var(--accent-green)]" />
          <h3 className="font-display text-lg text-[var(--text-primary)]">Step-by-Step Fix</h3>
        </div>
        <div className="space-y-5">
          {report.stepByStepFix.map((step) => (
            <div key={step.step} className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-display text-[var(--accent-green)]">{step.step}</span>
              </div>
              <div className="flex-1 space-y-2">
                <p className="font-ui text-sm text-[var(--text-primary)]">{step.instruction}</p>
                {step.code && <CodeBlock code={step.code} />}
                <p className="text-xs text-[var(--text-muted)] italic">{step.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Fixed Code */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[var(--accent-blue)]" />
            <h3 className="font-display text-lg text-[var(--text-primary)]">Fixed Code</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopyFixed}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              {copiedFixed ? <Check className="w-3.5 h-3.5 text-[var(--accent-green)]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedFixed ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
        </div>
        <CodeBlock code={report.fixedCode} />
      </motion.div>

      {/* What To Learn */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <WhatToLearnCard whatToLearn={report.whatToLearn} />
      </motion.div>

      {/* Similar Bugs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6 border-l-4 border-l-[var(--accent-yellow)]"
      >
        <div className="flex items-center gap-2 mb-5">
          <Lightbulb className="w-5 h-5 text-[var(--accent-yellow)]" />
          <h3 className="font-display text-lg text-[var(--text-primary)]">Similar Bugs to Watch</h3>
        </div>
        <div className="space-y-4">
          {report.similarBugs.map((bug, i) => (
            <div key={i} className="p-4 bg-[var(--surface-2)] rounded-btn border border-[var(--border)]">
              <p className="font-ui text-sm text-[var(--accent-yellow)] mb-1">{bug.pattern}</p>
              <p className="text-xs text-[var(--text-secondary)] mb-2">{bug.example}</p>
              <p className="text-xs text-[var(--text-muted)]">
                <span className="text-[var(--accent-green)]">How to avoid: </span>
                {bug.howToAvoid}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-5 flex items-start gap-3"
      >
        <Heart className="w-5 h-5 text-[var(--accent-red)] flex-shrink-0 mt-0.5" />
        <p className="text-[var(--text-secondary)] italic">{report.encouragement}</p>
      </motion.div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 pt-2">
        {onShareReport && (
          <button onClick={onShareReport} className="btn-secondary text-sm flex items-center gap-2">
            Share Report
          </button>
        )}
        {onDebugAnother && (
          <button onClick={onDebugAnother} className="btn-primary text-sm">
            Debug Another Bug →
          </button>
        )}
      </div>
    </div>
  )
}
