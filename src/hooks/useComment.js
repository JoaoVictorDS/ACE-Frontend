import { useMutation, useQuery } from '@tanstack/react-query'
import { createComment, deleteComment, getComments, updateComment } from '../services/commentService'

export const useComments = (itemId) => {
    return useQuery({
        queryKey: ['comments', itemId],
        queryFn: () => getComments(itemId),
        enabled: !!itemId
    })
}

export const useCreateComment = () => {
    const createCommentMutation = useMutation({
        mutationFn: createComment,
    })

    return {
        createComment: createCommentMutation.mutateAsync,
    }
}

export const useUpdateComment = () => {
    const updateCommentMutation = useMutation({
        mutationFn: updateComment,
    })

    return {
        updateComment: updateCommentMutation.mutateAsync,
    }
}

export const useDeleteComment = () => {
    const deleteCommentMutation = useMutation({
        mutationFn: deleteComment,
    })

    return {
        deleteComment: deleteCommentMutation.mutateAsync,
    }
}