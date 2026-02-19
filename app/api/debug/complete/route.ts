import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { answersSchema } from '@/lib/validations'
import { generateDebugReport } from '@/lib/anthropic'
import { sanitizeInput } from '@/lib/utils'
import { getCached, deleteCache } from '@/lib/redis'

// Edge Runtime gives 30s on Vercel Hobby (vs 10s for Node.js)
export const runtime = 'edge'
export const maxDuration = 30

interface SessionData {
    userId: string
    language: string
    code: string
    errorMessage: string
    questions: Array<{ id: string; question: string }>
    errorCategory: string
}

async function loadSession(sessionId: string): Promise<SessionData | null> {
    // Redis only — in-memory doesn't work across Vercel serverless instances
    try {
        return await getCached<SessionData>(`session:${sessionId}`)
    } catch {
        return null
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
        const validation = answersSchema.safeParse(body)
        if (!validation.success) {
            return Response.json(
                { error: validation.error.errors[0].message, code: 'VALIDATION_ERROR' },
                { status: 400 }
            )
        }

        const { sessionId, answers } = validation.data

        // 3. Load session
        const session = await loadSession(sessionId)
        if (!session) {
            return Response.json(
                { error: 'Session expired. Please start a new debug session.', code: 'SESSION_NOT_FOUND' },
                { status: 404 }
            )
        }

        if (session.userId !== userId) {
            return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
        }

        // 4. Format answers
        const answersFormatted = answers
            .map((a) => {
                const q = session.questions?.find((q) => q.id === a.questionId)
                return `Q: ${q?.question || 'Question'}\nA: ${sanitizeInput(a.answer)}`
            })
            .join('\n\n')

        // 5. Call Groq AI with 30s timeout
        let report
        try {
            report = await Promise.race([
                generateDebugReport(session.language, session.errorMessage, session.code, answersFormatted),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('AI timeout')), 30000)
                ),
            ])
        } catch (aiError) {
            console.error('AI error in debug/complete:', aiError)
            return Response.json(
                { error: 'AI service error. Please try again.', code: 'AI_UNAVAILABLE', retryable: true },
                { status: 503 }
            )
        }

        // 6. Clean up session from Redis
        await deleteCache(`session:${sessionId}`)

        return Response.json({ sessionId, report })

    } catch (error) {
        console.error('Debug complete error:', error)
        return Response.json(
            { error: 'Internal server error', code: 'INTERNAL_ERROR', retryable: true },
            { status: 500 }
        )
    }
}
