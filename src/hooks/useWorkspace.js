import { useQueryClient, useMutation } from '@tanstack/react-query'
import { createWorkspace } from '../services/workspaceService'

export const useWorkspace = () => {
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
