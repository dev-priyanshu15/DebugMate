import { useQuery } from '@tanstack/react-query'
import { WeakSpot } from '@/types'

async function fetchWeakSpots(): Promise<WeakSpot[]> {
    const res = await fetch('/api/user/weak-spots')
    if (!res.ok) throw new Error('Failed to fetch weak spots')
    return res.json()
}

export function useWeakSpots() {
    return useQuery({
        queryKey: ['weak-spots'],
        queryFn: fetchWeakSpots,
        staleTime: 10 * 60 * 1000,
    })
}
