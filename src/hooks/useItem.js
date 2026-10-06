import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateItemTitle, createItem } from '../services/itemService'

export const useUpdateItemTitle = () => {
    const updateItemTitleMutation = useMutation({
        mutationFn: updateItemTitle
    })

    return {
        updateItemTitle: updateItemTitleMutation.mutateAsync,
        updatingItemTitle: updateItemTitleMutation.isPending,
        updateItemTitleError: updateItemTitleMutation.error,
        updateItemTitleSuccess: updateItemTitleMutation.isSuccess,
        resetUpdateItemTitle: updateItemTitleMutation.reset
    }
}

export const useCreateItem = (boardId) => {
    const queryClient = useQueryClient()

    const createItemMutation = useMutation({
        mutationFn: createItem,

        onSuccess: (newItem) => {
            queryClient.setQueryData(['board', boardId], (currentBoard) => {
                if (!currentBoard) return currentBoard

                return {
                    ...currentBoard,
                    sections: currentBoard.sections.map((section) => {
                        if (section.id !== newItem.section_id) {
                            return section
                        }

                        const alreadyExists = section.items.some(
                            (item) => item.id === newItem.id
                        )

                        if (alreadyExists) {
                            return section
                        }

                        return {
                            ...section,
                            items: [...section.items, newItem]
                        }
                    })
                }
            })
        }
    })

    return {
        createItem: createItemMutation.mutateAsync,
        creatingItem: createItemMutation.isPending,
        createItemError: createItemMutation.error,
        createItemSuccess: createItemMutation.isSuccess,
        resetCreateItem: createItemMutation.reset
    }
}