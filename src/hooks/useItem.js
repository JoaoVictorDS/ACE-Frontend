import { useMutation } from '@tanstack/react-query'
import { updateItemTitle } from '../services/itemService'

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