import Razorpay from 'razorpay'
import crypto from 'crypto'

// Lazy client — only instantiated at runtime, not at build time
let _razorpay: Razorpay | null = null
export function getRazorpay(): Razorpay {
    if (!_razorpay) {
        _razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        })
    }
    return _razorpay
}

export const RAZORPAY_PLAN_IDS = {
    pro_monthly: process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID || 'plan_pro_monthly',
    pro_yearly: process.env.RAZORPAY_PRO_YEARLY_PLAN_ID || 'plan_pro_yearly',
    bootcamp_monthly:
        process.env.RAZORPAY_BOOTCAMP_MONTHLY_PLAN_ID || 'plan_bootcamp_monthly',
}

export async function createSubscription(
    planId: string,
    customerId?: string
): Promise<{ id: string; short_url: string }> {
    const subscription = await getRazorpay().subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        quantity: 1,
        total_count: 12,
        ...(customerId ? { customer_id: customerId } : {}),
    })

    return {
        id: subscription.id as string,
        short_url: ((subscription as unknown) as Record<string, unknown>).short_url as string,
    }
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
    await getRazorpay().subscriptions.cancel(subscriptionId, false)
}

export function verifyRazorpayWebhookSignature(
    body: string,
    signature: string,
    secret: string
): boolean {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex')

    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
    )
}
