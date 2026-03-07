import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
    sessionError: 'expired' | null

    setStep: (step: DebugStep) => void
    setSessionId: (id: string) => void
    setLanguage: (lang: SupportedLanguage) => void
    setCode: (code: string) => void
    setErrorMessage: (msg: string) => void
    setQuestions: (questions: ClarifyingQuestion[]) => void
    setReport: (report: DebugReport) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setSessionError: (error: 'expired' | null) => void
    reset: () => void
}

const initialState = {
    step: 'input' as DebugStep,
    sessionId: null as string | null,
    language: 'javascript' as SupportedLanguage,
    code: '',
    errorMessage: '',
    questions: [] as ClarifyingQuestion[],
    report: null as DebugReport | null,
    isLoading: false,
    error: null as string | null,
    sessionError: null as 'expired' | null,
}

export const useDebugSession = create<DebugSessionState>()(
    persist(
        (set) => ({
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
            setSessionError: (sessionError) => set({ sessionError }),
            reset: () => set(initialState),
        }),
        {
            name: 'debugmate-session',
            partialize: (state) => ({
                // Only persist essential session data, not transient UI state
                sessionId: state.sessionId,
                language: state.language,
                code: state.code,
                errorMessage: state.errorMessage,
                questions: state.questions,
                step: state.step,
            }),
        }
    )
)
