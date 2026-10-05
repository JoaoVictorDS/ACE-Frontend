import { useMutation } from '@tanstack/react-query'
import { upsertItemValue } from '../services/itemValueService'

export const useUpsertItemValue = () => {
    const upsertItemValueMutation = useMutation({
        mutationFn: upsertItemValue
    })

    return {
        upsertItemValue: upsertItemValueMutation.mutateAsync,
        upsertingItemValue: upsertItemValueMutation.isPending,
        upsertItemValueError: upsertItemValueMutation.error,
        upsertItemValueSuccess: upsertItemValueMutation.isSuccess,
        resetUpsertItemValue: upsertItemValueMutation.reset,
    }
}