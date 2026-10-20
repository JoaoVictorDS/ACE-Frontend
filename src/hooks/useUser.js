import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserProfile, getUsers, updateUserProfile, updateUserPassword, updateUserProfileById, deleteUser, reactivateUser, createUser } from '../services/userService'
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

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
        staleTime: 15 * 60 * 1000
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

export const useUpdateUserProfileById = () => {
    const queryClient = useQueryClient()

    const updateUserProfileByIdMutation = useMutation({
        mutationFn: updateUserProfileById,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })

    return {
        updateUserProfileById: updateUserProfileByIdMutation.mutateAsync,
        updatingUserProfileById: updateUserProfileByIdMutation.isPending,
        updateUserProfileByIdError: updateUserProfileByIdMutation.error,
        updateUserProfileByIdSuccess: updateUserProfileByIdMutation.isSuccess,
        resetUpdateUserProfileById: updateUserProfileByIdMutation.reset
    }
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()

    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })

    return {
        deleteUser: deleteUserMutation.mutateAsync,
        deletingUser: deleteUserMutation.isPending,
        deleteUserError: deleteUserMutation.error,
        deleteUserSuccess: deleteUserMutation.isSuccess,
        resetDeleteUser: deleteUserMutation.reset
    }
}

export const useReactivateUser = () => {
    const queryClient = useQueryClient()

    const reactivateUserMutation = useMutation({
        mutationFn: reactivateUser,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })

    return {
        reactivateUser: reactivateUserMutation.mutateAsync,
        reactivatingUser: reactivateUserMutation.isPending,
        reactivateUserError: reactivateUserMutation.error,
        reactivateUserSuccess: reactivateUserMutation.isSuccess,
        resetReactivateUser: reactivateUserMutation.reset
    }
}

export const useCreateUser = () => {
    const queryClient = useQueryClient()

    const createUserMutation = useMutation({
        mutationFn: createUser,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })

    return {
        createUser: createUserMutation.mutateAsync,
        creatingUser: createUserMutation.isPending,
        createUserError: createUserMutation.error,
        createUserSuccess: createUserMutation.isSuccess,
        resetCreateUser: createUserMutation.reset
    }
}