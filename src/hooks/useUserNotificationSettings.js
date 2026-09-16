import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserNotificationSettings, updateUserNotificationSettings } from '../services/userNotificationSettingsService'

export const useUserNotificationSettings = () => {
    const queryClient = useQueryClient()

    const userNotificationSettingsQuery = useQuery({
        queryKey: ['notification-settings'],
        queryFn: getUserNotificationSettings,
        staleTime: 60 * 1000,
        gcTime: 60 * 1000,
    })

    const updateUserNotificationSettingsMutation = useMutation({
        mutationFn: updateUserNotificationSettings,

        onSuccess: (updatedUserNotificationSettings) => {
            queryClient.setQueryData(['notification-settings'], updatedUserNotificationSettings)
        }
    })

    return {
        ...userNotificationSettingsQuery,

        updateUserNotificationSettings: updateUserNotificationSettingsMutation.mutateAsync,
        updatingUserNotificationSettings: updateUserNotificationSettingsMutation.isPending,
        updateUserNotificationSettingsError: updateUserNotificationSettingsMutation.error,
        updateUserNotificationSettingsSuccess: updateUserNotificationSettingsMutation.isSuccess,
        resetUpdateUserNotificationSettings: updateUserNotificationSettingsMutation.reset
    }
}
