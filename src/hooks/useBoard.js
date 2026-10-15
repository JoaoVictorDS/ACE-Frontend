import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getBoardsByWorkspace, getBoard, createBoard } from '../services/boardService'

export const useBoards = (workspaceId) => {
    return useQuery({
        queryKey: ['boards', workspaceId],
        queryFn: () => getBoardsByWorkspace(workspaceId),
        enabled: !!workspaceId
    })
}

export const useBoard = (boardId) => {
    return useQuery({
        queryKey: ['board', boardId],
        queryFn: () => getBoard(boardId),
        enabled: !!boardId
    })
}

export const useCreateBoard = () => {
    const queryClient = useQueryClient()

    const createBoardMutation = useMutation({
        mutationFn: createBoard,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['workspace']
            })
        }
    })

    return {
        createBoard: createBoardMutation.mutateAsync,
        creatingBoard: createBoardMutation.isPending,
        createBoardError: createBoardMutation.error,
        resetCreateBoard: createBoardMutation.reset,
    }
}