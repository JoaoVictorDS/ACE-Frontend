import { useEffect, useState } from 'react'
import { BoardSection } from '../BoardSection/BoardSection'
import { useResize } from '../../hooks/useResize'
import './BoardTable.css'

const MIN_ITEM_WIDTH = 150
const MAX_ITEM_WIDTH = 600
const DEFAULT_ITEM_WIDTH = 260

const MIN_COLUMN_WIDTH = 150
const MAX_COLUMN_WIDTH = 600
const DEFAULT_COLUMN_WIDTH = 170

export const BoardTable = ({ board, users, onItemTitleCommit, onItemOpen, onCellCommit, onUpdatePreferences, onCreateItem, onDeleteItem, addItemSectionId, onOpenAddItem, onCloseAddItem }) => {
    const columns = [...board.columns]
        .filter((column) => !column.deleted_at)
        .sort((a, b) => a.order - b.order)

    const sections = [...board.sections]
        .filter((section) => !section.deleted_at)
        .sort((a, b) => a.order - b.order)

    const [itemWidth, setItemWidth] = useState(board.preferences?.item_width ?? DEFAULT_ITEM_WIDTH)
    const [columnWidths, setColumnWidths] = useState(board.preferences?.column_widths ?? {})

    useEffect(() => {
        setItemWidth(board.preferences?.item_width ?? DEFAULT_ITEM_WIDTH)
        setColumnWidths(board.preferences?.column_widths ?? {})
    }, [board.id])

    const handleResize = ({ id, value }) => {
        if (id === 'item') {
            setItemWidth(value)
            return
        }

        setColumnWidths((current) => ({
            ...current,
            [id]: value
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

    const gridTemplateColumns = [
        '42px',
        `${itemWidth}px`,
        ...columns.map((column) => {
            const width = columnWidths[column.id]

            return width
                ? `${width}px`
                : `minmax(${DEFAULT_COLUMN_WIDTH}px, 1fr)`
        })
    ].join(' ')

    return (
        <div className="board-table-wrapper">
            <div
                className="board-table"
                style={{ '--board-grid-columns': gridTemplateColumns }}
            >
                <div className="board-table-header">
                    <div className="board-table-actions-header" />
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

                    {columns.map((column) => {
                        const width = columnWidths[column.id] ?? DEFAULT_COLUMN_WIDTH

                        return (
                            <div
                                key={column.id}
                                className={`board-table-column-header ${resizingId === column.id ? 'is-resizing' : ''}`}
                            >
                                <span>{column.name}</span>

                                <div
                                    className="board-resize-handle board-column-resize-handle"
                                    onPointerDown={(event) => handlePointerDown(event, {
                                        id: column.id,
                                        value: width,
                                        min: MIN_COLUMN_WIDTH,
                                        max: MAX_COLUMN_WIDTH
                                    })}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    onPointerCancel={handlePointerCancel}
                                />
                            </div>
                        )
                    })}
                </div>

                <div className="board-table-body">
                    {sections.map((section) => (
                        <BoardSection
                            key={section.id}
                            section={section}
                            columns={columns}
                            users={users}
                            board={board}
                            gridTemplateColumns={gridTemplateColumns}
                            onItemTitleCommit={onItemTitleCommit}
                            onItemOpen={onItemOpen}
                            onCellCommit={onCellCommit}
                            onCreateItem={onCreateItem}
                            onDeleteItem={onDeleteItem}
                            addItemOpen={section.id === addItemSectionId}
                            onOpenAddItem={onOpenAddItem}
                            onCloseAddItem={onCloseAddItem}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}