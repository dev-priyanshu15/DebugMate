import { NextRequest } from 'next/server'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        return Response.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    // Get headers
    const svix_id = request.headers.get('svix-id')
    const svix_timestamp = request.headers.get('svix-timestamp')
    const svix_signature = request.headers.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return Response.json({ error: 'Missing svix headers' }, { status: 400 })
    }

    const body = await request.text()

    // Verify webhook signature
    const wh = new Webhook(WEBHOOK_SECRET)
    let event: WebhookEvent

    try {
        event = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch {
        return Response.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Handle events
    switch (event.type) {
        case 'user.created': {
            const { id, email_addresses, first_name, last_name, image_url } = event.data
            const email = email_addresses[0]?.email_address

            if (!email) break

            await supabase.from('users').insert({
                clerk_id: id,
                email,
                full_name: [first_name, last_name].filter(Boolean).join(' ') || null,
                avatar_url: image_url || null,
                plan: 'free',
                sessions_used: 0,
                sessions_limit: 10,
                sessions_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
            break
        }

        case 'user.updated': {
            const { id, email_addresses, first_name, last_name, image_url } = event.data
            const email = email_addresses[0]?.email_address

            await supabase
                .from('users')
                .update({
                    email: email || undefined,
                    full_name: [first_name, last_name].filter(Boolean).join(' ') || null,
                    avatar_url: image_url || null,
                })
                .eq('clerk_id', id)
            break
        }

        case 'user.deleted': {
            const { id } = event.data
            if (id) {
                // Soft delete: anonymize user data but keep sessions for analytics
                await supabase
                    .from('users')
                    .update({
                        email: `deleted_${id}@deleted.com`,
                        full_name: null,
                        avatar_url: null,
                    })
                    .eq('clerk_id', id)
            }
            break
        }
    }

    return Response.json({ received: true })
}
