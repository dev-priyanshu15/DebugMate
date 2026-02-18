import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = auth()
        if (!userId) {
            return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED', retryable: false, retryAfter: null }, { status: 401 })
        }

        const supabase = getSupabaseServerClient()

        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_id', userId)
            .single()

        if (!user) {
            return Response.json({ error: 'User not found', code: 'USER_NOT_FOUND', retryable: false, retryAfter: null }, { status: 404 })
        }

        const { data: session, error } = await supabase
            .from('debug_sessions')
            .select('*')
            .eq('id', params.id)
            .or(`user_id.eq.${user.id},is_public.eq.true`)
            .single()

        if (error || !session) {
            return Response.json({ error: 'Session not found', code: 'SESSION_NOT_FOUND', retryable: false, retryAfter: null }, { status: 404 })
        }

        return Response.json(session)
    } catch (error) {
        console.error('Session get error:', error)
        return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', retryable: true, retryAfter: 5 }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = auth()
        if (!userId) {
            return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED', retryable: false, retryAfter: null }, { status: 401 })
        }

        const supabase = getSupabaseServerClient()

        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_id', userId)
            .single()

        if (!user) {
            return Response.json({ error: 'User not found', code: 'USER_NOT_FOUND', retryable: false, retryAfter: null }, { status: 404 })
        }

        const { error } = await supabase
            .from('debug_sessions')
            .delete()
            .eq('id', params.id)
            .eq('user_id', user.id)

        if (error) {
            return Response.json({ error: 'Failed to delete session', code: 'DB_ERROR', retryable: true, retryAfter: 3 }, { status: 500 })
        }

        return Response.json({ success: true })
    } catch (error) {
        console.error('Session delete error:', error)
        return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', retryable: true, retryAfter: 5 }, { status: 500 })
    }
}
