import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { subscriptionSchema } from '@/lib/validations'
import { getRazorpay, RAZORPAY_PLAN_IDS } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED', retryable: false, retryAfter: null }, { status: 401 })
        }

        const body = await request.json()
        const validation = subscriptionSchema.safeParse(body)
        if (!validation.success) {
            return Response.json({ error: validation.error.errors[0].message, code: 'VALIDATION_ERROR', retryable: false, retryAfter: null }, { status: 400 })
        }

        const { plan, billing } = validation.data
        const supabase = getSupabaseServerClient()

        const { data: user } = await supabase
            .from('users')
            .select('id, email, razorpay_customer_id')
            .eq('clerk_id', userId)
            .single()

        if (!user) {
            return Response.json({ error: 'User not found', code: 'USER_NOT_FOUND', retryable: false, retryAfter: null }, { status: 404 })
        }

        // Get plan ID
        const planKey = `${plan}_${billing}` as keyof typeof RAZORPAY_PLAN_IDS
        const planId = RAZORPAY_PLAN_IDS[planKey] || RAZORPAY_PLAN_IDS.pro_monthly

        // Create or get Razorpay customer
        let customerId = user.razorpay_customer_id
        if (!customerId) {
            const customer = await getRazorpay().customers.create({
                email: user.email,
                fail_existing: 0,
            } as Parameters<ReturnType<typeof getRazorpay>['customers']['create']>[0])
            customerId = customer.id as string

            await supabase
                .from('users')
                .update({ razorpay_customer_id: customerId })
                .eq('id', user.id)
        }

        // Create subscription
        const subscription = await getRazorpay().subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            quantity: 1,
            total_count: billing === 'yearly' ? 1 : 12,
        })

        return Response.json({
            subscriptionId: subscription.id,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            customerId,
            email: user.email,
        })
    } catch (error) {
        console.error('Create subscription error:', error)
        return Response.json({ error: 'Failed to create subscription', code: 'PAYMENT_ERROR', retryable: true, retryAfter: 5 }, { status: 500 })
    }
}
