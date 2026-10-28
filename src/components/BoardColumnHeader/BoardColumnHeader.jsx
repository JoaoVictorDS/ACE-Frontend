import { useEffect, useRef, useState } from 'react'
import { useSortable } from '@dnd-kit/react/sortable'
import { Ellipsis, GripVertical, Settings2, ShieldCheck, Trash2 } from 'lucide-react'
import './BoardColumnHeader.css'

export const BoardColumnHeader = ({
    column,
    index,
    width,
    storedWidth,
    minWidth,
    maxWidth,
    isResizing,
    onResizeStart,
    onResizeMove,
    onResizeEnd,
    onResizeCancel,
    onColumnNameCommit,
    onEdit,
    onConfigureRestrictions,
    onDelete
}) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [editingName, setEditingName] = useState(false)
    const [columnName, setColumnName] = useState(column.name ?? '')
    const [savingName, setSavingName] = useState(false)

    const menuRef = useRef(null)
    const nameInputRef = useRef(null)
    const savingNameRef = useRef(false)
    const cancelNameBlurRef = useRef(false)

    const { ref, handleRef, isDragging } = useSortable({
        id: `column-${column.id}`,
        index,
        type: 'column',
        accept: ['column'],
        group: 'board-columns',
        data: {
            columnId: column.id,
        }
    })

    useEffect(() => {
        if (!editingName) {
            setColumnName(column.name ?? '')
        }
    }, [column.name, editingName])

    useEffect(() => {
        if (editingName) {
            nameInputRef.current?.focus()
            nameInputRef.current?.select()
        }
    }, [editingName])

    useEffect(() => {
        if (!menuOpen) return

        const handlePointerDown = (event) => {
            if (!menuRef.current?.contains(event.target)) {
                setMenuOpen(false)
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
        }
    }, [menuOpen])

    const handleColumnResizeStart = (event) => {
        const renderedWidth =
            event.currentTarget.parentElement?.getBoundingClientRect().width

        const currentWidth = Number.isFinite(renderedWidth)
            && renderedWidth > 0
            ? Math.round(renderedWidth)
            : width

        onResizeStart(event, {
            id: column.id,
            value: currentWidth,
            previousValue: storedWidth,
            min: minWidth,
            max: maxWidth,
        })
    }

    const handleStartNameEdit = () => {
        if (savingNameRef.current) return

        setColumnName(column.name ?? '')
        cancelNameBlurRef.current = false
        setEditingName(true)
    }

    const handleCancelNameEdit = () => {
        if (savingNameRef.current) return

        cancelNameBlurRef.current = true
        setColumnName(column.name ?? '')
        setEditingName(false)
    }

    const handleCommitNameEdit = async () => {
        if (savingNameRef.current) return

        const nextName = columnName.trim()

        if (!nextName || nextName === column.name) {
            setColumnName(column.name ?? '')
            setEditingName(false)
            return
        }

        savingNameRef.current = true
        setSavingName(true)

        try {
            await onColumnNameCommit({
                column,
                name: nextName
            })

            setEditingName(false)
        } catch {
            // Mantém a edição aberta caso a atualização falhe.
        } finally {
            savingNameRef.current = false
            setSavingName(false)
        }
    }

    const handleNameKeyDown = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            await handleCommitNameEdit()
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            handleCancelNameEdit()
        }
    }

    const handleNameBlur = () => {
        if (cancelNameBlurRef.current) {
            cancelNameBlurRef.current = false
            return
        }

        if (!savingNameRef.current) {
            handleCommitNameEdit()
        }
    }

    const handleAction = (callback) => {
        setMenuOpen(false)
        callback(column)
    }

    return (
        <div
            ref={ref}
            className={[
                'board-table-column-header',
                'board-column-header',
                isDragging && 'is-dragging',
                isResizing && 'is-resizing'
            ].filter(Boolean).join(' ')}
        >
            <button
                ref={handleRef}
                type="button"
                className="board-column-drag-handle"
                title="Arrastar para reordenar"
                aria-label={`Mover coluna ${column.name}`}
            >
                <GripVertical size={15} />
            </button>

            {editingName ? (
                <input
                    ref={nameInputRef}
                    type="text"
                    className="board-column-name-input"
                    value={columnName}
                    disabled={savingName}
                    data-no-drag="true"
                    onChange={(event) => setColumnName(event.target.value)}
                    onKeyDown={handleNameKeyDown}
                    onBlur={handleNameBlur}
                    aria-label={`Editar nome da coluna ${column.name}`}
                />
            ) : (
                <button
                    type="button"
                    className="board-column-name-edit"
                    data-no-drag="true"
                    title={column.name}
                    onClick={handleStartNameEdit}
                >
                    <span className="board-column-header-name">
                        {column.name}
                    </span>
                </button>
            )}

            <div
                ref={menuRef}
                className="board-column-menu"
            >
                <button
                    type="button"
                    className="board-column-menu-trigger"
                    data-no-drag="true"
                    title="Configurações da coluna"
                    aria-label={`Configurações da coluna ${column.name}`}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((current) => !current)}
                >
                    <Ellipsis size={17} />
                </button>

                {menuOpen && (
                    <div className="board-column-menu-dropdown">
                        <button
                            type="button"
                            className="board-column-menu-option"
                            data-no-drag="true"
                            onClick={() => handleAction(onEdit)}
                        >
                            <Settings2 size={14} />
                            Configurar coluna
                        </button>

                        <button
                            type="button"
                            className="board-column-menu-option"
                            data-no-drag="true"
                            onClick={() => handleAction(onConfigureRestrictions)}
                        >
                            <ShieldCheck size={14} />
                            Restrições de acesso
                        </button>

                        <button
                            type="button"
                            className="board-column-menu-option board-column-menu-option-danger"
                            data-no-drag="true"
                            onClick={() => handleAction(onDelete)}
                        >
                            <Trash2 size={14} />
                            Excluir coluna
                        </button>
                    </div>
                )}
            </div>

            <div
                className="board-resize-handle board-column-resize-handle"
                data-no-drag="true"
                onPointerDown={handleColumnResizeStart}
                onPointerMove={onResizeMove}
                onPointerUp={onResizeEnd}
                onPointerCancel={onResizeCancel}
            />
        </div>
    )
}