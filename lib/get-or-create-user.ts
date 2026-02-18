import { getSupabaseServerClient } from '@/lib/supabase/server'

interface UserInfo {
    clerkUserId: string
    email?: string | null
    fullName?: string | null
    avatarUrl?: string | null
}

/**
 * Gets the user from Supabase by their Clerk ID.
 * If the user doesn't exist yet (e.g. webhook wasn't set up / fired),
 * it auto-creates them using the info passed from the Clerk session.
 */
export async function getOrCreateUser({ clerkUserId, email, fullName, avatarUrl }: UserInfo) {
    const supabase = getSupabaseServerClient()

    // Try to find existing user
    const { data: existingUser } = await supabase
        .from('users')
        .select('id, sessions_used, sessions_limit, plan, email, full_name')
        .eq('clerk_id', clerkUserId)
        .single()

    if (existingUser) return existingUser

    // User not in DB — auto-create with whatever info we have
    const userEmail = email || `${clerkUserId}@clerk.local`

    const { data: newUser, error } = await supabase
        .from('users')
        .insert({
            clerk_id: clerkUserId,
            email: userEmail,
            full_name: fullName || null,
            avatar_url: avatarUrl || null,
            plan: 'free',
            sessions_used: 0,
            sessions_limit: 10,
            sessions_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select('id, sessions_used, sessions_limit, plan, email, full_name')
        .single()

    if (error) {
        console.error('Failed to auto-create user:', JSON.stringify(error))
        return null
    }

    console.log('Auto-created user in DB for clerk_id:', clerkUserId)
    return newUser
}
