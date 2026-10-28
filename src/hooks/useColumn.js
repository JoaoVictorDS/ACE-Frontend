import { useMutation } from '@tanstack/react-query'
import { createColumn, updateColumn, moveColumn, deleteColumn } from '../services/columnService'

export const useCreateColumn = () => {
    const createColumnMutation = useMutation({
        mutationFn: createColumn,
    })

    return {
        createColumn: createColumnMutation.mutateAsync,
        creatingColumn: createColumnMutation.isPending,
        createColumnError: createColumnMutation.error,
        createColumnSuccess: createColumnMutation.isSuccess,
        resetCreateColumn: createColumnMutation.reset
    }
}

export const useUpdateColumn = () => {
    const updateColumnMutation = useMutation({
        mutationFn: updateColumn
    })

    return {
        updateColumn: updateColumnMutation.mutateAsync,
        updatingColumn: updateColumnMutation.isPending,
        resetUpdateColumn: updateColumnMutation.reset
    }
}

export const useMoveColumn = () => {
    const moveColumnMutation = useMutation({
        mutationFn: moveColumn
    })

    return {
        moveColumn: moveColumnMutation.mutateAsync
    }
}

export const useDeleteColumn = () => {
    const deleteColumnMutation = useMutation({
        mutationFn: deleteColumn
    })

    return {
        deleteColumn: deleteColumnMutation.mutateAsync,
        deletingColumn: deleteColumnMutation.error,
        resetDeleteColumn: deleteColumnMutation.reset
    }
}