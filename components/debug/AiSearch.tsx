'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Send, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AiSearchProps {
  context?: string
  placeholder?: string
}

function renderMarkdown(text: string) {
  // Simple markdown renderer for code blocks and basic formatting
  const parts = text.split(/(```[\s\S]*?```)/g)

  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const match = part.match(/```(\w*)\n?([\s\S]*?)```/)
      if (match) {
        const code = match[2].trim()
        return (
          <pre
            key={i}
            className="p-3 rounded-lg text-[12px] font-mono leading-relaxed overflow-x-auto my-3"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            <code>{code}</code>
          </pre>
        )
      }
    }

    // Handle inline code
    const inlineParts = part.split(/(`[^`]+`)/g)
    return (
      <span key={i}>
        {inlineParts.map((ip, j) => {
          if (ip.startsWith('`') && ip.endsWith('`')) {
            return (
              <code
                key={j}
                className="px-1 py-0.5 rounded text-[12px] font-mono"
                style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}
              >
                {ip.slice(1, -1)}
              </code>
            )
          }
          // Handle bold
          const boldParts = ip.split(/(\*\*[^*]+\*\*)/g)
          return boldParts.map((bp, k) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
              return <strong key={`${j}-${k}`} className="text-[var(--text)] font-bold">{bp.slice(2, -2)}</strong>
            }
            return bp
          })
        })}
      </span>
    )
  })
}

export function AiSearch({ context, placeholder }: AiSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<{ q: string; a: string }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history, answer])

  const handleSearch = async () => {
    if (!query.trim() || isLoading) return

    const q = query.trim()
    setQuery('')
    setIsLoading(true)
    setAnswer('')

    try {
      const res = await fetch('/api/debug/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, context }),
      })

      const data = await res.json()
      const a = data.answer || 'No answer available.'
      setAnswer(a)
      setHistory(prev => [...prev, { q, a }])
    } catch {
      const err = 'Failed to search. Please try again.'
      setAnswer(err)
      setHistory(prev => [...prev, { q, a: err }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] text-[13px] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all duration-200 w-full"
        style={{ background: 'var(--surface)' }}
      >
        <Search className="w-3.5 h-3.5" />
        {placeholder || 'Ask AI anything about this concept...'}
      </button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-[var(--border)] overflow-hidden"
      style={{ background: 'var(--surface)' }}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="text-[12px] font-bold text-[var(--text)]">AI Search</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-5 h-5 flex items-center justify-center rounded text-[var(--muted-2)] hover:text-[var(--text)] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="max-h-[300px] overflow-y-auto p-3 space-y-3">
        {history.length === 0 && !isLoading && (
          <p className="text-[12px] text-[var(--muted-2)] text-center py-4">
            Ask anything about the concept you just learned. The AI will answer right here.
          </p>
        )}

        {history.map((item, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-end">
              <div className="px-3 py-1.5 rounded-lg text-[13px] text-white max-w-[80%]" style={{ background: 'var(--accent)' }}>
                {item.q}
              </div>
            </div>
            <div className="text-[13px] text-[var(--muted)] leading-relaxed">
              {renderMarkdown(item.a)}
            </div>
          </div>
        ))}

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[12px] text-[var(--muted-2)]"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Thinking...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-t border-[var(--border)] flex gap-2">
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          className="flex-1 bg-transparent text-[13px] text-[var(--text)] placeholder-[var(--muted-2)] outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={!query.trim() || isLoading}
          className="w-7 h-7 flex items-center justify-center rounded text-[var(--accent)] disabled:opacity-30 hover:bg-[var(--surface-2)] transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}
