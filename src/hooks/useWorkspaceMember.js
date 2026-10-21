import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getWorkspaceMembers, upsertWorkspaceMember, removeWorkspaceMember } from '../services/workspaceMemberService'

export const useWorkspaceMembers = (workspaceId) => {
    return useQuery({
        queryKey: ['workspace-members', workspaceId],
        queryFn: () => getWorkspaceMembers(workspaceId),
        enabled: !!workspaceId
    })
}

export const useUpsertWorkspaceMember = () => {
    const queryClient = useQueryClient()

    const upsertWorkspaceMemberMutation = useMutation({
        mutationFn: upsertWorkspaceMember,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspace-members'] })
        }
    })

    return {
        upsertWorkspaceMember: upsertWorkspaceMemberMutation.mutateAsync,
        upsertingWorkspaceMember: upsertWorkspaceMemberMutation.isPending,
        upsertWorkspaceMemberError: upsertWorkspaceMemberMutation.error,
        upsertWorkspaceMemberSuccess: upsertWorkspaceMemberMutation.isSuccess,
        resetUpsertWorkspaceMember: upsertWorkspaceMemberMutation.reset
    }
}

export const useRemoveWorkspaceMember = () => {
    const queryClient = useQueryClient()

    const removeWorkspaceMemberMutation = useMutation({
        mutationFn: removeWorkspaceMember,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspace-members'] })
        }
    })

    return {
        removeWorkspaceMember: removeWorkspaceMemberMutation.mutateAsync,
        removingWorkspaceMember: removeWorkspaceMemberMutation.isPending,
        removeWorkspaceMemberError: removeWorkspaceMemberMutation.error,
        removeWorkspaceMemberSuccess: removeWorkspaceMemberMutation.isSuccess,
        resetRemoveWorkspaceMember: removeWorkspaceMemberMutation.reset
    }
}