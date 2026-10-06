import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getBoardMembers, updateBoardMemberPreferences } from '../services/boardMemberService'

export const useBoardMembers = (boardId) => {
    return useQuery({
        queryKey: ['board-members', boardId],
        queryFn: () => getBoardMembers(boardId),
        enabled: !!boardId
    })
}

export const useUpdateBoardMemberPreferences = (boardId) => {
    const queryClient = useQueryClient()

    const useUpdateBoardMemberPreferencesMutation = useMutation({
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
        updateBoardMemberPreferences: useUpdateBoardMemberPreferencesMutation.mutateAsync,
        updatingBoardMemberPreferences: useUpdateBoardMemberPreferencesMutation.isPending,
        updateBoardMemberPreferencesError: useUpdateBoardMemberPreferencesMutation.error
    }
}