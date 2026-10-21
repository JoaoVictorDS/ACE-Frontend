import { tableFeatures, rowSortingFeature, columnFilteringFeature, globalFilteringFeature, createSortedRowModel, createFilteredRowModel, sortFn_text } from '@tanstack/react-table'
import { normalizeText } from './text'

export const createDefaultTableFeatures = () => {
    return tableFeatures({
        columnFilteringFeature,
        globalFilteringFeature,
        rowSortingFeature,
        filteredRowModel: createFilteredRowModel(),
        sortedRowModel: createSortedRowModel(),
        sortFns: { text: sortFn_text }
    })
}

export const createGlobalTextFilter = (getSearchableText) => {
    return (row, columnId, filterValue) => {
        const search = normalizeText(String(filterValue ?? '').trim())

        if (!search) {
            return true
        }

        const searchableText = normalizeText(
            getSearchableText(row.original)
        )

        return searchableText.includes(search)
    }
}

export const filterByExactValue = (row, columnId, filterValue) => {
    return row.getValue(columnId) === filterValue
}