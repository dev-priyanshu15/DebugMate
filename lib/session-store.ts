// In-memory session store — fallback when Redis is unavailable
// Sessions expire after 30 minutes via TTL check
interface StoredSession {
    data: unknown
    expiresAt: number
}

const store = new Map<string, StoredSession>()

export function setSession(key: string, value: unknown, ttlSeconds = 1800) {
    store.set(key, { data: value, expiresAt: Date.now() + ttlSeconds * 1000 })
}

export function getSession<T>(key: string): T | null {
    const entry = store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
        store.delete(key)
        return null
    }
    return entry.data as T
}

export function deleteSession(key: string) {
    store.delete(key)
}
