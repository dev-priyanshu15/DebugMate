import { z } from 'zod'

// ============================================================
// SECURITY HELPERS
// ============================================================

export function containsMaliciousPatterns(input: string): boolean {
    const patterns = [
        /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /DROP\s+TABLE/gi,
        /DELETE\s+FROM/gi,
        /INSERT\s+INTO/gi,
        /UNION\s+SELECT/gi,
        /exec\s*\(/gi,
        /eval\s*\(/gi,
    ]
    return patterns.some((pattern) => pattern.test(input))
}

// ============================================================
// SUPPORTED LANGUAGES
// ============================================================

export const SUPPORTED_LANGUAGES = [
    'javascript',
    'typescript',
    'python',
    'java',
    'cpp',
    'rust',
    'go',
    'php',
    'ruby',
    'swift',
    'kotlin',
    'csharp',
    'html',
    'css',
    'sql',
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// ============================================================
// ZOD SCHEMAS
// ============================================================

export const debugInputSchema = z.object({
    code: z
        .string()
        .min(10, 'Code must be at least 10 characters')
        .max(10000, 'Code must be under 10,000 characters')
        .refine((val) => !containsMaliciousPatterns(val), 'Invalid input detected'),
    errorMessage: z
        .string()
        .min(5, 'Error message too short')
        .max(2000, 'Error message too long'),
    language: z.enum(SUPPORTED_LANGUAGES),
})

export const answersSchema = z.object({
    sessionId: z.string().uuid('Invalid session ID'),
    answers: z
        .array(
            z.object({
                questionId: z.string().min(1),
                answer: z
                    .string()
                    .min(1, 'Please provide an answer')
                    .max(500, 'Answer must be under 500 characters'),
            })
        )
        .length(3, 'Must provide exactly 3 answers'),
})

export const sessionIdSchema = z.object({
    id: z.string().uuid('Invalid session ID'),
})

export const userUpdateSchema = z.object({
    full_name: z.string().min(1).max(100).optional(),
    avatar_url: z.string().url().optional(),
})

export const subscriptionSchema = z.object({
    plan: z.enum(['pro', 'bootcamp']),
    billing: z.enum(['monthly', 'yearly']).default('monthly'),
})

// ============================================================
// TYPE EXPORTS
// ============================================================

export type DebugInput = z.infer<typeof debugInputSchema>
export type AnswersInput = z.infer<typeof answersSchema>
export type UserUpdate = z.infer<typeof userUpdateSchema>
export type SubscriptionInput = z.infer<typeof subscriptionSchema>
