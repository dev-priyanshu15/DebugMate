'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 card">
          <div className="w-12 h-12 rounded-xl bg-[rgba(255,92,124,0.08)] flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5 text-[var(--accent-red)]" />
          </div>
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
            We couldn&apos;t analyze this error yet
          </h3>
          <p className="text-[13px] text-[var(--text-muted)] text-center mb-5 max-w-sm">
            Try adding more context or refreshing the page. If the problem persists, please contact support.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-primary text-[13px] flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
