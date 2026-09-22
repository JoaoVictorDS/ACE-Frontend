import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserProfile, updateUserProfile, updateUserPassword } from '../services/userService'
import { STORAGE_KEYS } from '../constants/storageKeys'

export const useUser = () => {
    const hasToken = !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

    return useQuery({
        queryKey: ['user'],
        queryFn: getUserProfile,
        enabled: hasToken,
        staleTime: 5 * 60 * 1000,
    })
}

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient()

    const updateUserProfileMutation = useMutation({
        mutationFn: updateUserProfile,

        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['user'], updatedUser)
        },
    })

    return {
        updateUserProfile: updateUserProfileMutation.mutateAsync,
        updatingUserProfile: updateUserProfileMutation.isPending,
        updateUserProfileError: updateUserProfileMutation.error,
        updateUserProfileSuccess: updateUserProfileMutation.isSuccess,
        resetUpdateUserProfile: updateUserProfileMutation.reset,
    }
}

export const useUpdateUserPassword = () => {
    const updateUserPasswordMutation = useMutation({
        mutationFn: updateUserPassword
    })

    return {
        updateUserPassword: updateUserPasswordMutation.mutateAsync,
        updatingUserPassword: updateUserPasswordMutation.isPending,
        updateUserPasswordError: updateUserPasswordMutation.error,
        updateUserPasswordSuccess: updateUserPasswordMutation.isSuccess,
        resetUpdateUserPassword: updateUserPasswordMutation.reset,
    }
}