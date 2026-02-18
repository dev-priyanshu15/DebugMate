// ============================================================
// USER TYPES
// ============================================================

export type Plan = 'free' | 'pro' | 'bootcamp'

export interface User {
    id: string
    clerk_id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    plan: Plan
    sessions_used: number
    sessions_limit: number
    sessions_reset_at: string
    razorpay_customer_id: string | null
    razorpay_subscription_id: string | null
    subscription_status: string | null
    subscription_ends_at: string | null
    onboarding_completed: boolean
    created_at: string
    updated_at: string
}

// ============================================================
// DEBUG SESSION TYPES
// ============================================================

export type SessionStatus = 'pending' | 'clarifying' | 'complete' | 'failed'

export type SupportedLanguage =
    | 'javascript'
    | 'typescript'
    | 'python'
    | 'java'
    | 'cpp'
    | 'rust'
    | 'go'
    | 'php'
    | 'ruby'
    | 'swift'
    | 'kotlin'
    | 'csharp'
    | 'html'
    | 'css'
    | 'sql'

export interface ClarifyingQuestion {
    id: string
    question: string
}

export interface QuestionAnswer {
    questionId: string
    answer: string
}

export interface RootCause {
    summary: string
    explanation: string
    severity: 'low' | 'medium' | 'high'
}

export interface FixStep {
    step: number
    instruction: string
    code: string | null
    explanation: string
}

export interface WhatToLearn {
    concept: string
    whyItMatters: string
    searchQuery: string
    estimatedLearningTime: string
}

export interface SimilarBug {
    pattern: string
    example: string
    howToAvoid: string
}

export interface DebugReport {
    rootCause: RootCause
    stepByStepFix: FixStep[]
    fixedCode: string
    whatToLearn: WhatToLearn
    similarBugs: SimilarBug[]
    encouragement: string
    errorCategory: string
}

export interface DebugSession {
    id: string
    user_id: string
    language: SupportedLanguage
    code: string
    error_message: string
    clarifying_questions: ClarifyingQuestion[] | null
    user_answers: QuestionAnswer[] | null
    debug_report: DebugReport | null
    status: SessionStatus
    ai_tokens_used: number
    is_public: boolean
    public_slug: string | null
    created_at: string
    updated_at: string
}

// ============================================================
// WEAK SPOTS TYPES
// ============================================================

export interface WeakSpot {
    id: string
    user_id: string
    error_category: string
    language: SupportedLanguage
    occurrence_count: number
    last_seen_at: string
    related_concept: string | null
}

// ============================================================
// SUBSCRIPTION TYPES
// ============================================================

export interface Subscription {
    id: string
    user_id: string
    razorpay_subscription_id: string
    plan: Plan
    status: string
    current_period_start: string | null
    current_period_end: string | null
    created_at: string
}

// ============================================================
// BOOTCAMP TYPES
// ============================================================

export interface BootcampTeam {
    id: string
    owner_id: string
    name: string
    seats_total: number
    seats_used: number
    invite_code: string
    created_at: string
}

export interface BootcampMember {
    id: string
    team_id: string
    user_id: string
    role: 'student' | 'instructor'
    joined_at: string
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiError {
    error: string
    code: string
    retryable: boolean
    retryAfter: number | null
}

export interface StartDebugResponse {
    sessionId: string
    questions: ClarifyingQuestion[]
    errorCategory: string
}

export interface CompleteDebugResponse {
    sessionId: string
    report: DebugReport
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    hasMore: boolean
}

// ============================================================
// PRICING TYPES
// ============================================================

export interface PricingPlan {
    id: Plan
    name: string
    price: {
        monthly: number
        yearly: number
    }
    sessions: string
    features: string[]
    highlighted: boolean
    razorpayPlanId?: string
}

// ============================================================
// FORM TYPES
// ============================================================

export interface DebugFormInput {
    code: string
    errorMessage: string
    language: SupportedLanguage
}

export interface AnswerFormInput {
    answers: QuestionAnswer[]
}
