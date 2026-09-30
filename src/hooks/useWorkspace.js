import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getWorkspaces, getWorkspace, createWorkspace } from '../services/workspaceService'

export const useWorkspaces = () => {
    return useQuery({
        queryKey: ['workspaces'],
        queryFn: getWorkspaces,
        staleTime: 15 * 60 * 1000
    })
}

export const useWorkspace = (workspaceId) => {
    return useQuery({
        queryKey: ['workspace', workspaceId],
        queryFn: () => getWorkspace(workspaceId),
        staleTime: 15 * 60 * 1000,
        enabled: !!workspaceId
    })
}

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient()

    const createWorkspaceMutation = useMutation({
        mutationFn: createWorkspace,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['workspaces']
            })
        }
    })

    return {
        createWorkspace: createWorkspaceMutation.mutateAsync,
        creatingWorkspace: createWorkspaceMutation.isPending,
        createWorkspaceError: createWorkspaceMutation.error,
        resetCreateWorkspace: createWorkspaceMutation.reset
    }
}