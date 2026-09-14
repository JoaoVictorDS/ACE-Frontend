import { useQuery } from '@tanstack/react-query'
import { getUserProfile } from '../services/userService'
import { STORAGE_KEYS } from '../constants/storageKeys'

export const useUser = () => {
    const hasToken = !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: getUserProfile,
        enabled: hasToken,
        staleTime: 5 * 60 * 1000,
    })

    return {
        ...userQuery
    }
}