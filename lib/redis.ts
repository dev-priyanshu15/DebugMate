import { Redis } from '@upstash/redis'
import { setSession, getSession as getMemorySession, deleteSession as deleteMemorySession } from './session-store'

let redis: Redis | null = null

try {
    redis = Redis.fromEnv()
} catch {
    console.warn('Redis not available, using in-memory fallback')
}

export { redis }

export async function getCached<T>(key: string): Promise<T | null> {
    // Try Redis first
    if (redis) {
        try {
            const cached = await redis.get<T>(key)
            if (cached !== null && cached !== undefined) return cached
        } catch (err) {
            console.warn('Redis get failed, trying in-memory fallback:', err)
        }
    }

    // Fallback to in-memory store
    return getMemorySession<T>(key)
}

export async function setCache<T>(
    key: string,
    value: T,
    ttlSeconds: number = 3600
): Promise<void> {
    // Always store in-memory as fallback
    setSession(key, value, ttlSeconds)

    // Also try Redis
    if (redis) {
        try {
            await redis.set(key, value, { ex: ttlSeconds })
        } catch (error) {
            console.warn('Redis cache set failed, using in-memory fallback:', error)
        }
    }
}

export async function deleteCache(key: string): Promise<void> {
    // Delete from both stores
    deleteMemorySession(key)

    if (redis) {
        try {
            await redis.del(key)
        } catch (error) {
            console.warn('Redis cache delete failed:', error)
        }
    }
}
