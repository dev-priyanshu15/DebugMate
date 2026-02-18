import { create } from 'zustand'
import { ClarifyingQuestion, DebugReport, SupportedLanguage } from '@/types'

type DebugStep = 'input' | 'clarifying' | 'generating' | 'complete'

interface DebugSessionState {
    step: DebugStep
    sessionId: string | null
    language: SupportedLanguage
    code: string
    errorMessage: string
    questions: ClarifyingQuestion[]
    report: DebugReport | null
    isLoading: boolean
    error: string | null

    setStep: (step: DebugStep) => void
    setSessionId: (id: string) => void
    setLanguage: (lang: SupportedLanguage) => void
    setCode: (code: string) => void
    setErrorMessage: (msg: string) => void
    setQuestions: (questions: ClarifyingQuestion[]) => void
    setReport: (report: DebugReport) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    reset: () => void
}

const initialState = {
    step: 'input' as DebugStep,
    sessionId: null,
    language: 'javascript' as SupportedLanguage,
    code: '',
    errorMessage: '',
    questions: [],
    report: null,
    isLoading: false,
    error: null,
}

export const useDebugSession = create<DebugSessionState>((set) => ({
    ...initialState,
    setStep: (step) => set({ step }),
    setSessionId: (sessionId) => set({ sessionId }),
    setLanguage: (language) => set({ language }),
    setCode: (code) => set({ code }),
    setErrorMessage: (errorMessage) => set({ errorMessage }),
    setQuestions: (questions) => set({ questions }),
    setReport: (report) => set({ report }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    reset: () => set(initialState),
}))
