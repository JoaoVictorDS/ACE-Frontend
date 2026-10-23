import { useMutation } from '@tanstack/react-query'
import { createSection, updateSectionName, moveSection, deleteSection, } from '../services/sectionService'


export const useCreateSection = () => {
    const createSectionMutation = useMutation({
        mutationFn: createSection
    })

    return {
        createSection: createSectionMutation.mutateAsync,
        creatingSection: createSectionMutation.isPending,
        createSectionError: createSectionMutation.error,
        createSectionSuccess: createSectionMutation.isSuccess,
        resetCreateSection: createSectionMutation.reset
    }
}

export const useUpdateSectionName = () => {
    const updateSectionNameMutation = useMutation({
        mutationFn: updateSectionName
    })

    return {
        updateSectionName: updateSectionNameMutation.mutateAsync,
        updatingSectionName: updateSectionNameMutation.isPending,
        updateSectionNameError: updateSectionNameMutation.error,
        updateSectionNameSuccess: updateSectionNameMutation.isSuccess,
        resetUpdateSectionName: updateSectionNameMutation.reset
    }
}

export const useMoveSection = () => {
    const moveSectionMutation = useMutation({
        mutationFn: moveSection
    })

    return {
        moveSection: moveSectionMutation.mutateAsync,
        movingSection: moveSectionMutation.isPending,
        moveSectionError: moveSectionMutation.error,
        moveSectionSuccess: moveSectionMutation.isSuccess,
        resetMoveSection: moveSectionMutation.reset
    }
}

export const useDeleteSection = () => {
    const deleteSectionMutation = useMutation({
        mutationFn: deleteSection
    })

    return {
        deleteSection: deleteSectionMutation.mutateAsync,
        deletingSection: deleteSectionMutation.isPending,
        deleteSectionError: deleteSectionMutation.error,
        deleteSectionSuccess: deleteSectionMutation.isSuccess,
        resetDeleteSection: deleteSectionMutation.reset
    }
}