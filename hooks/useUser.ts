import { useQuery } from '@tanstack/react-query'
import { User } from '@/types'

async function fetchUser(): Promise<User> {
    const res = await fetch('/api/user')
    if (!res.ok) throw new Error('Failed to fetch user')
    return res.json()
}

export function useUserData() {
    return useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        staleTime: 5 * 60 * 1000,
    })
}
