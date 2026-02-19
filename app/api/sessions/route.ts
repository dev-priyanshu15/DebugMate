import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const { userId } = auth()
        if (!userId) {
            return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED', retryable: false, retryAfter: null }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const pageSize = parseInt(searchParams.get('pageSize') || '10')
        const offset = (page - 1) * pageSize

        const supabase = getSupabaseServerClient()

        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_id', userId)
            .single()

        if (!user) {
            // User not in DB yet — return empty list (user will be created on /api/user)
            return Response.json({ data: [], total: 0, page, pageSize, hasMore: false })
        }

        const { data: sessions, error, count } = await supabase
            .from('debug_sessions')
            .select('id, language, error_message, status, created_at, debug_report', { count: 'exact' })
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + pageSize - 1)

        if (error) {
            return Response.json({ error: 'Failed to fetch sessions', code: 'DB_ERROR', retryable: true, retryAfter: 3 }, { status: 500 })
        }

        return Response.json({
            data: sessions,
            total: count || 0,
            page,
            pageSize,
            hasMore: (count || 0) > offset + pageSize,
        })
    } catch (error) {
        console.error('Sessions list error:', error)
        return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', retryable: true, retryAfter: 5 }, { status: 500 })
    }
}
