
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAvailability, getAvailabilityDay, getAvailabilityMonth, getAvailabilityHistory, updateAvailabilityStatus, upsertAvailabilityNotes, updateUserAvailabilityStatus, upsertUserAvailabilityNotes, updateUserAvailabilityPeriods } from '../services/availabilityService'

export const useAvailability = () => {
    return useQuery({
        queryKey: ['availability'],
        queryFn: getAvailability,
        staleTime: 30 * 1000
    })
}

export const useAvailabilityDay = ({ userId, workDate } = {}) => {
    return useQuery({
        queryKey: ['availability', 'day', { userId, workDate }],
        queryFn: () => getAvailabilityDay({ userId, workDate }),
        enabled: !!userId && !!workDate,
        staleTime: 30 * 1000
    })
}

export const useAvailabilityMonth = ({ userId, year, month } = {}) => {
    const normalizedYear = year === undefined ? undefined : Number(year)
    const normalizedMonth = month === undefined ? undefined : Number(month)

    const isValidYear = Number.isInteger(normalizedYear) && normalizedYear >= 1000 && normalizedYear <= 9999
    const isValidMonth = Number.isInteger(normalizedMonth) && normalizedMonth >= 1 && normalizedMonth <= 12

    return useQuery({
        queryKey: ['availability', 'month', { userId, year: normalizedYear, month: normalizedMonth }],
        queryFn: () => getAvailabilityMonth({ userId, year: normalizedYear, month: normalizedMonth }),
        enabled: !!userId && isValidYear && isValidMonth,
        staleTime: 30 * 1000
    })
}

export const useAvailabilityHistory = ({ page = 1, limit = 10 } = {}) => {
    return useQuery({
        queryKey: ['availability', 'logs', { page, limit }],
        queryFn: () => getAvailabilityHistory({ page, limit }),
        staleTime: 30 * 1000,
        placeholderData: (previousData) => previousData
    })
}

export const useUpdateAvailabilityStatus = () => {
    const updateAvailabilityStatusMutation = useMutation({
        mutationFn: updateAvailabilityStatus
    })

    return {
        updateAvailabilityStatus: updateAvailabilityStatusMutation.mutateAsync,
        updatingAvailabilityStatus: updateAvailabilityStatusMutation.isPending,
        updateAvailabilityStatusError: updateAvailabilityStatusMutation.error,
        updateAvailabilityStatusSuccess: updateAvailabilityStatusMutation.isSuccess,
        resetUpdateAvailabilityStatus: updateAvailabilityStatusMutation.reset
    }
}

export const useUpsertAvailabilityNotes = () => {
    const upsertAvailabilityNotesMutation = useMutation({
        mutationFn: upsertAvailabilityNotes
    })

    return {
        upsertAvailabilityNotes: upsertAvailabilityNotesMutation.mutateAsync,
        upsertingAvailabilityNotes: upsertAvailabilityNotesMutation.isPending,
        upsertAvailabilityNotesError: upsertAvailabilityNotesMutation.error,
        upsertAvailabilityNotesSuccess: upsertAvailabilityNotesMutation.isSuccess,
        resetUpsertAvailabilityNotes: upsertAvailabilityNotesMutation.reset
    }
}

export const useUpdateUserAvailabilityStatus = () => {
    const updateUserAvailabilityStatusMutation = useMutation({
        mutationFn: updateUserAvailabilityStatus
    })

    return {
        updateUserAvailabilityStatus: updateUserAvailabilityStatusMutation.mutateAsync,
        updatingUserAvailabilityStatus: updateUserAvailabilityStatusMutation.isPending,
        updateUserAvailabilityStatusError: updateUserAvailabilityStatusMutation.error,
        updateUserAvailabilityStatusSuccess: updateUserAvailabilityStatusMutation.isSuccess,
        resetUpdateUserAvailabilityStatus: updateUserAvailabilityStatusMutation.reset
    }
}

export const useUpsertUserAvailabilityNotes = () => {
    const upsertUserAvailabilityNotesMutation = useMutation({
        mutationFn: upsertUserAvailabilityNotes
    })

    return {
        upsertUserAvailabilityNotes: upsertUserAvailabilityNotesMutation.mutateAsync,
        upsertingUserAvailabilityNotes: upsertUserAvailabilityNotesMutation.isPending,
        upsertUserAvailabilityNotesError: upsertUserAvailabilityNotesMutation.error,
        upsertUserAvailabilityNotesSuccess: upsertUserAvailabilityNotesMutation.isSuccess,
        resetUpsertUserAvailabilityNotes: upsertUserAvailabilityNotesMutation.reset
    }
}

export const useUpdateUserAvailabilityPeriods = () => {
    const updateUserAvailabilityPeriodsMutation = useMutation({
        mutationFn: updateUserAvailabilityPeriods
    })

    return {
        updateUserAvailabilityPeriods: updateUserAvailabilityPeriodsMutation.mutateAsync,
        updatingUserAvailabilityPeriods: updateUserAvailabilityPeriodsMutation.isPending,
        updateUserAvailabilityPeriodsError: updateUserAvailabilityPeriodsMutation.error,
        updateUserAvailabilityPeriodsSuccess: updateUserAvailabilityPeriodsMutation.isSuccess,
        resetUpdateUserAvailabilityPeriods: updateUserAvailabilityPeriodsMutation.reset
    }
}
