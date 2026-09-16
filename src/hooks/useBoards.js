import { useQuery } from "@tanstack/react-query"
import { getBoardsByWorkspace } from '../services/boardService'

export const useBoards = (workspaceId) => {
    return useQuery({
        queryKey: ['boards', workspaceId],
        queryFn: () => getBoardsByWorkspace(workspaceId),
        enabled: !!workspaceId
    })
}