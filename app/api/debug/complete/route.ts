import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { answersSchema } from '@/lib/validations'
import { generateDebugReport } from '@/lib/anthropic'
import { sanitizeInput } from '@/lib/utils'
import { getSession, deleteSession } from '@/lib/session-store'

interface SessionData {
    userId: string
    language: string
    code: string
    errorMessage: string
    questions: Array<{ id: string; question: string }>
    errorCategory: string
}

async function loadSession(sessionId: string): Promise<SessionData | null> {
    // Try in-memory first (fastest)
    const mem = getSession<SessionData>(`session:${sessionId}`)
    if (mem) return mem

    // Try Redis fallback
    try {
        const { getCached } = await import('@/lib/redis')
        const cached = await Promise.race([
            getCached<SessionData>(`session:${sessionId}`),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
        ])
        return cached
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

        // 6. Clean up session
        deleteSession(`session:${sessionId}`)

        return Response.json({ sessionId, report })

    } catch (error) {
        console.error('Debug complete error:', error)
        return Response.json(
            { error: 'Internal server error', code: 'INTERNAL_ERROR', retryable: true },
            { status: 500 }
        )
    }
}
