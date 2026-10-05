import { useEffect, useRef, useState } from 'react'
import { BoardSection } from '../BoardSection/BoardSection'
import './BoardTable.css'

const MIN_COLUMN_WIDTH = 150
const MAX_COLUMN_WIDTH = 600
const DEFAULT_COLUMN_WIDTH = 170

export const BoardTable = ({ board, users, onItemTitleCommit, onItemOpen, onCellCommit, onUpdatePreferences }) => {
    const columns = [...board.columns]
        .filter((column) => !column.deleted_at)
        .sort((a, b) => a.order - b.order)

    const sections = [...board.sections]
        .filter((section) => !section.deleted_at)
        .sort((a, b) => a.order - b.order)

    const [columnWidths, setColumnWidths] = useState(board.preferences?.column_widths ?? {})
    const [resizingColumnId, setResizingColumnId] = useState(null)
    const resizeRef = useRef(null)

    useEffect(() => {
        setColumnWidths(board.preferences?.column_widths ?? {})
    }, [board.id])

    const handleResizeStart = (event, column) => {
        event.preventDefault()
        event.stopPropagation()

        const startWidth = columnWidths[column.id] ?? DEFAULT_COLUMN_WIDTH

        resizeRef.current = {
            columnId: column.id,
            startX: event.clientX,
            startWidth,
            currentWidth: startWidth,
            initialWidths: board.preferences?.column_widths ?? {}
        }

        setResizingColumnId(column.id)

        document.body.style.userSelect = 'none'
    }

    useEffect(() => {
        if (!resizingColumnId) {
            return
        }

        const handleMouseMove = (event) => {
            const resize = resizeRef.current

            if (!resize) return

            const newWidth = Math.min(
                MAX_COLUMN_WIDTH,
                Math.max(
                    MIN_COLUMN_WIDTH,
                    resize.startWidth + (event.clientX - resize.startX)
                )
            )

            resize.currentWidth = newWidth

            setColumnWidths((current) => ({
                ...current,
                [resize.columnId]: newWidth
            }))
        }

        const handleMouseUp = async () => {
            const resize = resizeRef.current

            if (!resize) return

            try {
                if (resize.currentWidth !== resize.startWidth) {
                    const newWidths = {
                        ...resize.initialWidths,
                        [resize.columnId]: resize.currentWidth
                    }

                    await onUpdatePreferences({
                        column_widths: newWidths
                    })
                }
            } finally {
                resizeRef.current = null
                setResizingColumnId(null)
                document.body.style.userSelect = ''
            }
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.body.style.userSelect = ''
        }
    }, [resizingColumnId, onUpdatePreferences])

    const gridTemplateColumns = [
        'minmax(220px, 1.5fr)',
        ...columns.map((column) => {
            const width = columnWidths[column.id]

            return width
                ? `${width}px`
                : 'minmax(170px, 1fr)'
        }),
        '42px'
    ].join(' ')

    return (
        <div className="board-table-wrapper">
            <div
                className="board-table"
                style={{ '--board-grid-columns': gridTemplateColumns }}
            >
                <div className="board-table-header">
                    <div
                        className={`board-table-item-header ${columns.length === 0 ? 'board-table-item-header-empty' : ''}`}
                    >
                        <span>{board.item_label_plural}</span>
                    </div>

                    {columns.map((column) => (
                        <div
                            key={column.id}
                            className={`board-table-column-header ${resizingColumnId === column.id ? 'is-resizing' : ''}`}
                        >
                            <span>{column.name}</span>

                            <div
                                className="board-column-resize-handle"
                                onMouseDown={(event) => handleResizeStart(event, column)}
                            />
                        </div>
                    ))}

                    {columns.length > 0 && (
                        <div className="board-table-end-header" />
                    )}
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
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}