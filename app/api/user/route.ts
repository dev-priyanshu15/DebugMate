import { auth, currentUser } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { userUpdateSchema } from '@/lib/validations'
import { getOrCreateUser } from '@/lib/get-or-create-user'

export async function GET() {
    try {
        const { userId } = auth()
        if (!userId) {
            return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED', retryable: false, retryAfter: null }, { status: 401 })
        }

        const clerkUser = await currentUser()
        const user = await getOrCreateUser({
            clerkUserId: userId,
            email: clerkUser?.emailAddresses?.[0]?.emailAddress,
            fullName: [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || null,
            avatarUrl: clerkUser?.imageUrl,
        })

        if (!user) {
            return Response.json({ error: 'Failed to load user account', code: 'USER_NOT_FOUND', retryable: false, retryAfter: null }, { status: 404 })
        }

        return Response.json(user)
    } catch (error) {
        console.error('User get error:', error)
        return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', retryable: true, retryAfter: 5 }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { userId } = auth()
        if (!userId) {
            return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED', retryable: false, retryAfter: null }, { status: 401 })
        }

        const body = await request.json()
        const validation = userUpdateSchema.safeParse(body)
        if (!validation.success) {
            return Response.json({ error: validation.error.errors[0].message, code: 'VALIDATION_ERROR', retryable: false, retryAfter: null }, { status: 400 })
        }

        const supabase = getSupabaseServerClient()

        const { data: user, error } = await supabase
            .from('users')
            .update(validation.data)
            .eq('clerk_id', userId)
            .select()
            .single()

        if (error || !user) {
            return Response.json({ error: 'Failed to update user', code: 'DB_ERROR', retryable: true, retryAfter: 3 }, { status: 500 })
        }

        return Response.json(user)
    } catch (error) {
        console.error('User update error:', error)
        return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', retryable: true, retryAfter: 5 }, { status: 500 })
    }
}
