import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { debugInputSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'
import { generateClarifyingQuestions } from '@/lib/anthropic'
import { setCache } from '@/lib/redis'

// Edge functions have dep compatibility issues — use Node.js runtime
export const maxDuration = 60
export const dynamic = 'force-dynamic'

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

        // 4. Store session in Redis only (in-memory doesn't work across Vercel serverless instances)
        const sessionId = crypto.randomUUID()
        const sessionData = { userId, language, code, errorMessage, questions, errorCategory }
        await setCache(`session:${sessionId}`, sessionData, 1800)

        return Response.json({ sessionId, questions, errorCategory })

    } catch (error) {
        console.error('Debug start error:', error)
        return Response.json(
            { error: 'Internal server error', code: 'INTERNAL_ERROR', retryable: true },
            { status: 500 }
        )
    }
}
