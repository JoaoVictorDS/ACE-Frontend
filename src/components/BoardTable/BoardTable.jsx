import { useEffect, useRef, useState } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { PointerSensor, PointerActivationConstraints } from '@dnd-kit/dom'
import { BoardColumnHeader } from '../BoardColumnHeader/BoardColumnHeader'
import { isSortable } from '@dnd-kit/react/sortable'
import { BoardSection } from '../BoardSection/BoardSection'
import { AddSectionRow } from '../AddSectionRow/AddSectionRow'
import { useResize } from '../../hooks/useResize'
import { Plus } from 'lucide-react'
import './BoardTable.css'

const MIN_ITEM_WIDTH = 150
const MAX_ITEM_WIDTH = 1500
const DEFAULT_ITEM_WIDTH = 250

const MIN_COLUMN_WIDTH = 150
const MAX_COLUMN_WIDTH = 1500
const DEFAULT_COLUMN_WIDTH = 250

const boardSensors = (defaults) => [
    ...defaults.filter((sensor) => sensor !== PointerSensor),
    PointerSensor.configure({
        activationConstraints: [
            new PointerActivationConstraints.Distance({ value: 6 })
        ],
        preventActivation: (event) => {
            const target = event.target

            if (!(target instanceof Element)) return false

            if (target.closest('[data-no-drag]')) {
                return true
            }

            if (target.closest('.board-cell-user-editing, .board-cell-select-editing')) {
                return true
            }

            return Boolean(target.closest(
                'input:not([type="checkbox"]), select, textarea, [contenteditable="true"]'
            ))
        }
    })
]

export const BoardTable = ({
    board,
    users,
    canMoveBoardStructure,
    onItemTitleCommit,
    onItemOpen,
    onCellCommit,
    onUpdatePreferences,
    onCreateItem,
    onDeleteItem,
    addItemSectionId,
    onOpenAddItem,
    onCloseAddItem,
    selectedItemIds,
    onToggleItemSelection,
    allItemsSelected,
    someItemsSelected,
    onToggleAllItems,
    onToggleSectionSelection,
    onMoveItem,
    addSectionOpen,
    onOpenAddSection,
    onCloseAddSection,
    onCreateSection,
    onSectionNameCommit,
    onMoveSection,
    onDeleteSection,
    onCreateColumn,
    onColumnNameCommit,
    onEditColumn,
    onConfigureColumnRestrictions,
    onMoveColumn,
    onDeleteColumn,
}) => {
    const selectAllRef = useRef(null)

    const [itemWidth, setItemWidth] = useState(board.preferences?.item_width ?? DEFAULT_ITEM_WIDTH)
    const [columnWidths, setColumnWidths] = useState(board.preferences?.column_widths ?? {})
    const columns = [...board.columns].filter((column) => !column.deleted_at).sort((a, b) => a.order - b.order)
    const sections = [...board.sections].filter((section) => !section.deleted_at).sort((a, b) => a.order - b.order)

    useEffect(() => {
        setItemWidth(board.preferences?.item_width ?? DEFAULT_ITEM_WIDTH)
        setColumnWidths(board.preferences?.column_widths ?? {})
    }, [board.id])

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someItemsSelected
        }
    }, [someItemsSelected])

    const handleResize = ({ id, value }) => {
        if (id === 'item') {
            setItemWidth(value)
            return
        }

        if (value == null) {
            setColumnWidths((current) => {
                const next = { ...current }
                delete next[id]
                return next
            })

            return
        }

        setColumnWidths((current) => ({
            ...current,
            [id]: value,
        }))
    }

    const handleResizeCommit = async ({ id, value }) => {
        if (id === 'item') {
            await onUpdatePreferences({
                item_width: value
            })
            return
        }

        const newWidths = {
            ...columnWidths,
            [id]: value
        }

        await onUpdatePreferences({
            column_widths: newWidths
        })
    }

    const { resizingId, handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel } = useResize({ onResize: handleResize, onCommit: handleResizeCommit })

    const handleColumnDragEnd = (event) => {
        const { source, target } = event.operation

        if (event.canceled || !target || !isSortable(source)) {
            return
        }

        if (source.type !== 'column' || target.type !== 'column') {
            return
        }

        const { index, initialIndex } = source
        const columnId = source.data?.columnId

        if (columnId == null || index === initialIndex) {
            return
        }

        const targetColumn = columns[index]

        if (!targetColumn || targetColumn.id === columnId) {
            return
        }

        onMoveColumn({
            columnId,
            newOrder: targetColumn.order,
        })
    }

    const handleDragEnd = (event) => {
        const { source, target } = event.operation

        if (event.canceled || !target?.id || !isSortable(source)) {
            return
        }

        const { id, index, initialIndex, group, initialGroup } = source

        if (source.type === 'section') {
            const sectionId = source.data?.sectionId

            if (sectionId == null || index === initialIndex) {
                return
            }

            onMoveSection({
                sectionId,
                newOrder: index
            })

            return
        }

        if (source.type !== 'item') {
            return
        }

        if (index === initialIndex && group === initialGroup && id === target.id) {
            return
        }

        if (target.type === 'item' && group !== target.group) {
            return
        }

        const isSectionTarget = target.type === 'section'

        const payload = {
            itemId: id,
            newOrder: isSectionTarget
                ? Number(target.data?.itemCount ?? 0)
                : target.index,
            newSectionId: isSectionTarget
                ? target.data?.sectionId ?? target.id
                : undefined
        }

        onMoveItem(payload)
    }

    const handleDragOver = (event) => {
        const { target, source } = event.operation

        if (source?.type === 'section') {
            return
        }

        if (target?.group !== source?.group) {
            event.preventDefault()
        }
    }

    const gridTemplateColumns = [
        '42px', `${itemWidth}px`,
        ...columns.map((column) => {
            const width = columnWidths[column.id]

            return width
                ? `${width}px`
                : `minmax(${DEFAULT_COLUMN_WIDTH}px, 1fr)`
        }), '42px'
    ].join(' ')

    return (
        <div className="board-table-wrapper">
            <div
                className="board-table"
                style={{ '--board-grid-columns': gridTemplateColumns }}
            >
                <DragDropProvider
                    onDragEnd={handleColumnDragEnd}
                    sensors={boardSensors}
                >
                    <div className="board-table-header">
                        <div className="board-table-selection-header">
                            <input
                                ref={selectAllRef}
                                type="checkbox"
                                checked={allItemsSelected}
                                onChange={onToggleAllItems}
                                aria-label="Selecionar todos os itens"
                            />
                        </div>

                        <div className={`board-table-item-header ${columns.length === 0 ? 'board-table-item-header-empty' : ''} ${resizingId === 'item' ? 'is-resizing' : ''}`}>
                            <span>{board.item_label_plural}</span>

                            <div
                                className="board-resize-handle board-item-resize-handle"
                                onPointerDown={(event) => handlePointerDown(event, {
                                    id: 'item',
                                    value: itemWidth,
                                    min: MIN_ITEM_WIDTH,
                                    max: MAX_ITEM_WIDTH
                                })}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerCancel}
                            />
                        </div>

                        {columns.map((column, index) => {
                            const width = columnWidths[column.id] ?? DEFAULT_COLUMN_WIDTH

                            return (
                                <BoardColumnHeader
                                    key={column.id}
                                    column={column}
                                    index={index}
                                    canMoveBoardStructure={canMoveBoardStructure}
                                    width={width}
                                    storedWidth={columnWidths[column.id] ?? null}
                                    minWidth={MIN_COLUMN_WIDTH}
                                    maxWidth={MAX_COLUMN_WIDTH}
                                    isResizing={resizingId === column.id}
                                    onResizeStart={handlePointerDown}
                                    onResizeMove={handlePointerMove}
                                    onResizeEnd={handlePointerUp}
                                    onResizeCancel={handlePointerCancel}
                                    onColumnNameCommit={onColumnNameCommit}
                                    onEdit={onEditColumn}
                                    onConfigureRestrictions={onConfigureColumnRestrictions}
                                    onDelete={onDeleteColumn}
                                />
                            )
                        })}

                        <div className="board-table-end-header">
                            <button
                                type="button"
                                className="board-table-add-column"
                                data-no-drag="true"
                                title="Adicionar coluna"
                                aria-label="Adicionar coluna"
                                onClick={onCreateColumn}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </DragDropProvider>

                <DragDropProvider
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    sensors={boardSensors}
                >
                    <div className="board-table-body">

                        {sections.map((section, index) => (
                            <BoardSection
                                key={section.id}
                                index={index}
                                section={section}
                                columns={columns}
                                users={users}
                                board={board}
                                canMoveBoardStructure={canMoveBoardStructure}
                                gridTemplateColumns={gridTemplateColumns}
                                onItemTitleCommit={onItemTitleCommit}
                                onItemOpen={onItemOpen}
                                onCellCommit={onCellCommit}
                                onCreateItem={onCreateItem}
                                onDeleteItem={onDeleteItem}
                                onSectionNameCommit={onSectionNameCommit}
                                onDeleteSection={onDeleteSection}
                                addItemOpen={section.id === addItemSectionId}
                                onOpenAddItem={onOpenAddItem}
                                onCloseAddItem={onCloseAddItem}
                                selectedItemIds={selectedItemIds}
                                onToggleItemSelection={onToggleItemSelection}
                                onToggleSectionSelection={onToggleSectionSelection}
                            />
                        ))}

                        <AddSectionRow
                            open={addSectionOpen}
                            onOpen={onOpenAddSection}
                            onClose={onCloseAddSection}
                            onCreate={onCreateSection}
                        />
                    </div>
                </DragDropProvider>
            </div >
        </div >
    )
}