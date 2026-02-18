'use client'

import dynamic from 'next/dynamic'
import { SupportedLanguage } from '@/types'
import { getLanguageIcon } from '@/lib/utils'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const LANGUAGES: { value: SupportedLanguage; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'csharp', label: 'C#' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
]

interface CodeEditorProps {
  language: SupportedLanguage
  code: string
  errorMessage: string
  onLanguageChange: (lang: SupportedLanguage) => void
  onCodeChange: (code: string) => void
  onErrorMessageChange: (msg: string) => void
}

export function CodeEditor({
  language,
  code,
  errorMessage,
  onLanguageChange,
  onCodeChange,
  onErrorMessageChange,
}: CodeEditorProps) {
  return (
    <div className="space-y-4">
      {/* Language selector */}
      <div>
        <label className="block text-sm font-ui text-[var(--text-secondary)] mb-2">
          Programming Language
        </label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
          className="input-field font-ui text-sm"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {getLanguageIcon(lang.value)} {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Code editor */}
      <div>
        <label className="block text-sm font-ui text-[var(--text-secondary)] mb-2">
          Paste Your Code
          <span className="ml-2 text-[var(--text-muted)] text-xs">
            ({code.length}/10000 chars)
          </span>
        </label>
        <div className="rounded-btn overflow-hidden border border-[var(--border)] focus-within:border-[var(--accent-blue)] transition-colors">
          <MonacoEditor
            height="320px"
            language={language === 'csharp' ? 'csharp' : language === 'cpp' ? 'cpp' : language}
            value={code}
            onChange={(val) => onCodeChange(val || '')}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: '"DM Mono", monospace',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              padding: { top: 12, bottom: 12 },
              wordWrap: 'on',
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      {/* Error message */}
      <div>
        <label className="block text-sm font-ui text-[var(--text-secondary)] mb-2">
          Error Message / What&apos;s Going Wrong
          <span className="ml-2 text-[var(--text-muted)] text-xs">
            ({errorMessage.length}/2000 chars)
          </span>
        </label>
        <textarea
          value={errorMessage}
          onChange={(e) => onErrorMessageChange(e.target.value)}
          placeholder="Paste the error message or describe what's happening..."
          rows={4}
          maxLength={2000}
          className="input-field resize-none font-mono text-sm"
        />
      </div>
    </div>
  )
}
