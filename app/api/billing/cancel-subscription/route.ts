import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

export const dynamic = 'force-dynamic'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { cancelSubscription } from '@/lib/razorpay'

export async function POST() {
    try {
        const { userId } = auth()
        if (!userId) {
            return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED', retryable: false, retryAfter: null }, { status: 401 })
        }

        const supabase = getSupabaseServerClient()

        const { data: user } = await supabase
            .from('users')
            .select('id, razorpay_subscription_id')
            .eq('clerk_id', userId)
            .single()

        if (!user || !user.razorpay_subscription_id) {
            return Response.json({ error: 'No active subscription', code: 'NO_SUBSCRIPTION', retryable: false, retryAfter: null }, { status: 404 })
        }

        await cancelSubscription(user.razorpay_subscription_id)

        return Response.json({ success: true, message: 'Subscription will be cancelled at period end' })
    } catch (error) {
        console.error('Cancel subscription error:', error)
        return Response.json({ error: 'Failed to cancel subscription', code: 'PAYMENT_ERROR', retryable: true, retryAfter: 5 }, { status: 500 })
    }
}
