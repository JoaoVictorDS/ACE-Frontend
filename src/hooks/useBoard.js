import { useQuery } from "@tanstack/react-query"
import { getBoardsByWorkspace, getBoard } from '../services/boardService'

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