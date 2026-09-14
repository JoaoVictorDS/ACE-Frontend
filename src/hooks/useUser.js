import { useQuery } from '@tanstack/react-query'
import { getUserProfile } from '../services/userService'
import { useAuth } from './useAuth'

export const useUser = () => {
    const { isAuthenticated } = useAuth()

    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: getUserProfile,
        enabled: isAuthenticated,
    })

    return {
        ...userQuery
    }
}