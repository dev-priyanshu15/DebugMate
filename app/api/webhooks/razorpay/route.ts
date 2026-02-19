import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
    const signature = request.headers.get('x-razorpay-signature')
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
        return Response.json({ error: 'Missing signature' }, { status: 400 })
    }

    const body = await request.text()

    // Verify signature
    const isValid = verifyRazorpayWebhookSignature(body, signature, webhookSecret)
    if (!isValid) {
        return Response.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = getSupabaseServerClient()

    switch (event.event) {
        case 'subscription.activated': {
            const { subscription } = event.payload
            const subscriptionId = subscription.entity.id
            const planId = subscription.entity.plan_id

            // Determine plan from plan ID
            const plan = planId.includes('bootcamp') ? 'bootcamp' : 'pro'

            // Find user by razorpay_subscription_id or customer_id
            const customerId = subscription.entity.customer_id

            if (customerId) {
                await supabase
                    .from('users')
                    .update({
                        plan,
                        razorpay_subscription_id: subscriptionId,
                        subscription_status: 'active',
                        sessions_limit: 999999,
                    })
                    .eq('razorpay_customer_id', customerId)
            }
            break
        }

        case 'subscription.charged': {
            const { subscription, payment } = event.payload
            const subscriptionId = subscription.entity.id

            // Log payment - idempotent upsert
            await supabase.from('subscriptions').upsert(
                {
                    razorpay_subscription_id: subscriptionId,
                    plan: subscription.entity.plan_id.includes('bootcamp') ? 'bootcamp' : 'pro',
                    status: 'active',
                    current_period_start: new Date(
                        subscription.entity.current_start * 1000
                    ).toISOString(),
                    current_period_end: new Date(
                        subscription.entity.current_end * 1000
                    ).toISOString(),
                },
                { onConflict: 'razorpay_subscription_id' }
            )
            break
        }

        case 'subscription.cancelled': {
            const { subscription } = event.payload
            const subscriptionId = subscription.entity.id

            // Downgrade at period end
            await supabase
                .from('users')
                .update({
                    subscription_status: 'cancelled',
                    subscription_ends_at: new Date(
                        subscription.entity.current_end * 1000
                    ).toISOString(),
                })
                .eq('razorpay_subscription_id', subscriptionId)
            break
        }

        case 'payment.failed': {
            // Log failure - could send email here
            console.error('Payment failed:', event.payload)
            break
        }
    }

    return Response.json({ received: true })
}
