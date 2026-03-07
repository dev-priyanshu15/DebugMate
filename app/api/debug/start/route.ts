import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { debugInputSchema } from '@/lib/validations'
import { generateClarifyingQuestions } from '@/lib/anthropic'
import { setCache } from '@/lib/redis'

// Edge functions have dep compatibility issues — use Node.js runtime
export const dynamic = 'force-dynamic'
export const maxDuration = 60

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

        // 3. Generate clarifying questions (retries + fallback handled internally)
        const result = await generateClarifyingQuestions(language, errorMessage, code)

        // 4. Store session (Redis + in-memory fallback)
        const sessionId = crypto.randomUUID()
        const sessionData = { userId, language, code, errorMessage, questions: result.questions, errorCategory: result.errorCategory }
        await setCache(`session:${sessionId}`, sessionData, 1800)

        return Response.json({ sessionId, questions: result.questions, errorCategory: result.errorCategory })

    } catch (error) {
        console.error('Debug start error:', error)
        return Response.json(
            { error: 'Internal server error', code: 'INTERNAL_ERROR', retryable: true },
            { status: 500 }
        )
    }
}
