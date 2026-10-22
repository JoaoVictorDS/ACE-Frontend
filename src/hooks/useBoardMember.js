import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getBoardMembers, updateBoardMemberPreferences, upsertBoardMember, removeBoardMember } from '../services/boardMemberService'

export const useBoardMembers = (boardId) => {
    return useQuery({
        queryKey: ['board-members', boardId],
        queryFn: () => getBoardMembers(boardId),
        enabled: !!boardId
    })
}

export const useUpdateBoardMemberPreferences = (boardId) => {
    const queryClient = useQueryClient()

    const updateBoardMemberPreferencesMutation = useMutation({
        mutationFn: (preferences) => updateBoardMemberPreferences({ boardId, preferences }),

        onSuccess: (data) => {
            queryClient.setQueryData(['board', boardId], (currentBoard) => {
                if (!currentBoard) return currentBoard

                return {
                    ...currentBoard,
                    preferences: {
                        ...currentBoard.preferences,
                        ...data.preferences
                    }
                }
            })

        }
    })

    return {
        updateBoardMemberPreferences: updateBoardMemberPreferencesMutation.mutateAsync,
        updatingBoardMemberPreferences: updateBoardMemberPreferencesMutation.isPending,
        updateBoardMemberPreferencesError: updateBoardMemberPreferencesMutation.error
    }
}

export const useUpsertBoardMember = () => {
    const queryClient = useQueryClient()

    const upsertBoardMemberMutation = useMutation({
        mutationFn: upsertBoardMember,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board-members'] })
        }
    })

    return {
        upsertBoardMember: upsertBoardMemberMutation.mutateAsync,
        upsertingBoardMember: upsertBoardMemberMutation.isPending,
        upsertBoardMemberError: upsertBoardMemberMutation.error,
        upsertBoardMemberSuccess: upsertBoardMemberMutation.isSuccess,
        resetUpsertBoardMember: upsertBoardMemberMutation.reset
    }
}

export const useRemoveBoardMember = () => {
    const queryClient = useQueryClient()

    const removeBoardMemberMutation = useMutation({
        mutationFn: removeBoardMember,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board-members'] })
        }
    })

    return {
        removeBoardMember: removeBoardMemberMutation.mutateAsync,
        removingBoardMember: removeBoardMemberMutation.isPending,
        removeBoardMemberError: removeBoardMemberMutation.error,
        removeBoardMemberSuccess: removeBoardMemberMutation.isSuccess,
        resetRemoveBoardMember: removeBoardMemberMutation.reset
    }
}