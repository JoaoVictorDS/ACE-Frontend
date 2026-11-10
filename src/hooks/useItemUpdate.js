import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createItemUpdate, deleteItemUpdate, getItemUpdates, updateItemUpdate, } from '../services/itemUpdateService'

export const useItemUpdates = (itemId) => {
    return useQuery({
        queryKey: ['item-updates', itemId],
        queryFn: () => getItemUpdates(itemId),
        enabled: !!itemId
    })
}

export const useCreateItemUpdate = () => {
    const createItemUpdateMutation = useMutation({
        mutationFn: createItemUpdate,
    })

    return {
        createItemUpdate: createItemUpdateMutation.mutateAsync,
    }
}

export const useUpdateItemUpdate = () => {
    const updateItemUpdateMutation = useMutation({
        mutationFn: updateItemUpdate,
    })

    return {
        updateItemUpdate: updateItemUpdateMutation.mutateAsync,
    }
}

export const useDeleteItemUpdate = () => {
    const deleteItemUpdateMutation = useMutation({
        mutationFn: deleteItemUpdate,
    })

    return {
        deleteItemUpdate: deleteItemUpdateMutation.mutateAsync,
    }
}