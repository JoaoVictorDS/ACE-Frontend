import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getWorkspaceMembers, upsertMember, removeMember } from '../services/workspaceMemberService'

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
        mutationFn: upsertMember,

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

    const useRemoveWorkspaceMemberMutation = useMutation({
        mutationFn: removeMember,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspace-members'] })
        }
    })

    return {
        removeWorkspaceMember: useRemoveWorkspaceMemberMutation.mutateAsync,
        removingWorkspaceMember: useRemoveWorkspaceMemberMutation.isPending,
        removeWorkspaceMemberError: useRemoveWorkspaceMemberMutation.error,
        removeWorkspaceMemberSuccess: useRemoveWorkspaceMemberMutation.isSuccess,
        resetRemoveWorkspaceMember: useRemoveWorkspaceMemberMutation.reset
    }
}