import { Redis } from '@upstash/redis'

export const redis = Redis.fromEnv()

export async function getCached<T>(key: string): Promise<T | null> {
    try {
        const cached = await redis.get<T>(key)
        return cached
    } catch {
        return null
    }
}

export async function setCache<T>(
    key: string,
    value: T,
    ttlSeconds: number = 3600
): Promise<void> {
    try {
        await redis.set(key, value, { ex: ttlSeconds })
    } catch (error) {
        console.error('Redis cache set error:', error)
    }
}

export async function deleteCache(key: string): Promise<void> {
    try {
        await redis.del(key)
    } catch (error) {
        console.error('Redis cache delete error:', error)
    }
}
