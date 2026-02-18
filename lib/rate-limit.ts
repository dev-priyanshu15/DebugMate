import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { Plan } from '@/types'

// Lazy Redis + Ratelimit — only instantiated at runtime, not at build time
let _redis: Redis | null = null
function getRedis(): Redis {
    if (!_redis) _redis = Redis.fromEnv()
    return _redis
}

let _debugStartRatelimit: Ratelimit | null = null
let _debugCompleteRatelimit: Ratelimit | null = null

export function getDebugStartRatelimit(): Ratelimit {
    if (!_debugStartRatelimit) {
        _debugStartRatelimit = new Ratelimit({
            redis: getRedis(),
            limiter: Ratelimit.slidingWindow(20, '1 h'),
            analytics: true,
            prefix: 'ratelimit:debug:start',
        })
    }
    return _debugStartRatelimit
}

export function getDebugCompleteRatelimit(): Ratelimit {
    if (!_debugCompleteRatelimit) {
        _debugCompleteRatelimit = new Ratelimit({
            redis: getRedis(),
            limiter: Ratelimit.slidingWindow(10, '1 h'),
            analytics: true,
            prefix: 'ratelimit:debug:complete',
        })
    }
    return _debugCompleteRatelimit
}

// Keep named exports for backward compat (lazy getters)
export const debugStartRatelimit = { limit: (...args: Parameters<Ratelimit['limit']>) => getDebugStartRatelimit().limit(...args) }
export const debugCompleteRatelimit = { limit: (...args: Parameters<Ratelimit['limit']>) => getDebugCompleteRatelimit().limit(...args) }

export function getRateLimitForPlan(plan: Plan) {
    switch (plan) {
        case 'pro':
            return new Ratelimit({
                redis: getRedis(),
                limiter: Ratelimit.slidingWindow(100, '1 h'),
                analytics: true,
                prefix: 'ratelimit:pro',
            })
        case 'bootcamp':
            return new Ratelimit({
                redis: getRedis(),
                limiter: Ratelimit.slidingWindow(200, '1 h'),
                analytics: true,
                prefix: 'ratelimit:bootcamp',
            })
        default:
            return new Ratelimit({
                redis: getRedis(),
                limiter: Ratelimit.slidingWindow(20, '1 h'),
                analytics: true,
                prefix: 'ratelimit:free',
            })
    }
}

export async function checkRateLimit(
    limiter: { limit: (id: string) => Promise<{ success: boolean; limit: number; reset: number; remaining: number }> },
    identifier: string
): Promise<Response | null> {
    const { success, limit, reset, remaining } = await limiter.limit(identifier)

    if (!success) {
        return Response.json(
            {
                error: 'Rate limit exceeded. Please try again later.',
                code: 'RATE_LIMIT_EXCEEDED',
                retryable: true,
                retryAfter: Math.ceil((reset - Date.now()) / 1000),
            },
            {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': String(limit),
                    'X-RateLimit-Remaining': String(remaining),
                    'X-RateLimit-Reset': String(reset),
                    'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
                },
            }
        )
    }

    return null
}
