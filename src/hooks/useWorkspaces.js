import { useQuery } from '@tanstack/react-query'
import { getWorkspaces } from '../services/workspaceService'

export const useWorkspaces = () => {
    return useQuery({
        queryKey: ['workspaces'],
        queryFn: getWorkspaces,
        staleTime: 15 * 60 * 1000
    })
}
