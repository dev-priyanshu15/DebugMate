import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { debugInputSchema } from '@/lib/validations'
import { generateClarifyingQuestions } from '@/lib/anthropic'
import { setSession } from '@/lib/session-store'
import { randomUUID } from 'crypto'

async function safeCacheSet(key: string, value: unknown) {
    try {
        const { setCache } = await import('@/lib/redis')
        await Promise.race([
            setCache(key, value, 1800),
            new Promise<void>((resolve) => setTimeout(resolve, 3000)),
        ])
    } catch {
        // Redis unavailable — in-memory store is already set
    }
}

export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate
        const { userId } = auth()
        if (!userId) {
            return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
        }

        // 2. Validate input
        const body = await request.json()
        const validation = debugInputSchema.safeParse(body)
        if (!validation.success) {
            return Response.json(
                { error: validation.error.errors[0].message, code: 'VALIDATION_ERROR' },
                { status: 400 }
            )
        }

        const { code, errorMessage, language } = validation.data

        // 3. Call Groq AI with 30s timeout
        let questions: Array<{ id: string; question: string }>
        let errorCategory: string

        try {
            const result = await Promise.race([
                generateClarifyingQuestions(language, errorMessage, code),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('AI timeout')), 30000)
                ),
            ])
            questions = result.questions
            errorCategory = result.errorCategory
        } catch (aiError) {
            console.error('AI error in debug/start:', aiError)
            return Response.json(
                { error: 'AI service error. Please try again.', code: 'AI_UNAVAILABLE', retryable: true },
                { status: 503 }
            )
        }

        // 4. Store session in memory + Redis
        const sessionId = randomUUID()
        const sessionData = { userId, language, code, errorMessage, questions, errorCategory }
        setSession(`session:${sessionId}`, sessionData, 1800)
        await safeCacheSet(`session:${sessionId}`, sessionData)

        return Response.json({ sessionId, questions, errorCategory })

    } catch (error) {
        console.error('Debug start error:', error)
        return Response.json(
            { error: 'Internal server error', code: 'INTERNAL_ERROR', retryable: true },
            { status: 500 }
        )
    }
}
