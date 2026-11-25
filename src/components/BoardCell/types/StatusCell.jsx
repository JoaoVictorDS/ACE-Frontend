import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Ban, Check, Circle, CircleCheck, CircleHelp, CircleMinus, CircleX, Clock3, LoaderCircle } from 'lucide-react'
import { EmptyCell } from './EmptyCell'
import './StatusCell.css'

const STATUS_OPTIONS = [
    {
        value: 'NOT_STARTED',
        label: 'Não iniciado',
        className: 'not-started',
        Icon: Circle
    },
    {
        value: 'IN_PROGRESS',
        label: 'Em andamento',
        className: 'in-progress',
        Icon: LoaderCircle
    },
    {
        value: 'WAITING',
        label: 'Aguardando',
        className: 'waiting',
        Icon: Clock3
    },
    {
        value: 'BLOCKED',
        label: 'Bloqueado',
        className: 'blocked',
        Icon: Ban
    },
    {
        value: 'COMPLETED',
        label: 'Concluído',
        className: 'completed',
        Icon: CircleCheck
    },
    {
        value: 'CANCELED',
        label: 'Cancelado',
        className: 'canceled',
        Icon: CircleX
    }
]

export const StatusCell = ({ value, editing, saving, inputRef, handleStartEditing, handleCancel, handleCommit, column }) => {
    const anchorRef = useRef(null)
    const menuRef = useRef(null)

    const [menuPosition, setMenuPosition] = useState(null)

    const isMenuPositioned = menuPosition !== null
    const selectedStatus = STATUS_OPTIONS.find((option) => option.value === value)
    const focusIndex = Math.max(STATUS_OPTIONS.findIndex((option) => option.value === value), 0)

    useEffect(() => {
        if (!editing) return

        const handleOutsideClick = (event) => {
            const clickedAnchor = anchorRef.current?.contains(event.target)
            const clickedMenu = menuRef.current?.contains(event.target)

            if (!clickedAnchor && !clickedMenu) {
                handleCancel()
            }
        }

        const handleEscapeKey = (event) => {
            if (event.key !== 'Escape') return

            event.preventDefault()
            event.stopPropagation()
            handleCancel()
        }

        document.addEventListener('pointerdown', handleOutsideClick)
        document.addEventListener('keydown', handleEscapeKey, true)

        return () => {
            document.removeEventListener('pointerdown', handleOutsideClick)
            document.removeEventListener('keydown', handleEscapeKey, true)
        }
    }, [editing, handleCancel])

    useLayoutEffect(() => {
        if (!editing) {
            setMenuPosition(null)
            return
        }

        const updateMenuPosition = () => {
            const anchor = anchorRef.current
            const menu = menuRef.current

            if (!anchor || !menu) return

            const anchorRect = anchor.getBoundingClientRect()
            const menuRect = menu.getBoundingClientRect()

            const viewportPadding = 8
            const gap = 5

            const spaceBelow = window.innerHeight - anchorRect.bottom - viewportPadding - gap
            const spaceAbove = anchorRect.top - viewportPadding - gap
            const menuHeight = menu.scrollHeight
            const openAbove = spaceBelow < menuHeight && spaceAbove > spaceBelow
            const availableHeight = Math.max(0, openAbove ? spaceAbove : spaceBelow)
            const visibleHeight = Math.min(menuHeight, availableHeight)

            const top = openAbove
                ? anchorRect.top - gap - visibleHeight
                : anchorRect.bottom + gap

            const left = Math.max(
                viewportPadding,
                Math.min(anchorRect.left, window.innerWidth - menuRect.width - viewportPadding)
            )

            setMenuPosition({
                top,
                left,
                maxHeight: availableHeight
            })
        }

        updateMenuPosition()

        window.addEventListener('resize', updateMenuPosition)
        document.addEventListener('scroll', updateMenuPosition, true)

        return () => {
            window.removeEventListener('resize', updateMenuPosition)
            document.removeEventListener('scroll', updateMenuPosition, true)
        }
    }, [editing])

    useLayoutEffect(() => {
        if (!editing || !isMenuPositioned) return

        inputRef.current?.focus()
    }, [editing, isMenuPositioned, inputRef])

    const renderStatusIndicator = (status) => {
        const Icon = status?.Icon ?? CircleHelp

        return (
            <span
                className={`board-cell-status-indicator ${status?.className ?? 'unknown'}`}
            >
                <span className="board-cell-status-icon">
                    <Icon size={14} strokeWidth={2.2} />
                </span>

                <span className="board-cell-status-label">
                    {status?.label ?? value}
                </span>
            </span>
        )
    }

    if (editing) {
        return (
            <>
                <button
                    ref={anchorRef}
                    type="button"
                    className="board-cell board-cell-status-editing"
                    aria-label={`Fechar edição de ${column.name}`}
                    onClick={handleCancel}
                />

                {createPortal(
                    <div
                        ref={menuRef}
                        className="board-cell-status-menu"
                        style={{
                            top: menuPosition?.top ?? 0,
                            left: menuPosition?.left ?? 0,
                            maxHeight: menuPosition?.maxHeight ?? 'calc(100vh - 16px)',
                            visibility: menuPosition ? 'visible' : 'hidden'
                        }}
                        role="group"
                        aria-label={`Selecionar ${column.name}`}
                    >
                        <div className="board-cell-status-menu-header">
                            Alterar {column.name}
                        </div>

                        {STATUS_OPTIONS.map((option, index) => {
                            const Icon = option.Icon
                            const isSelected = option.value === value

                            return (
                                <button
                                    key={option.value}
                                    ref={index === focusIndex ? inputRef : null}
                                    type="button"
                                    aria-pressed={isSelected}
                                    className={`board-cell-status-menu-item ${option.className} ${isSelected ? 'is-selected' : ''}`}
                                    disabled={saving}
                                    onClick={() => handleCommit(option.value)}
                                >
                                    <span className="board-cell-status-icon">
                                        <Icon size={14} strokeWidth={2.2} />
                                    </span>

                                    <span className="board-cell-status-menu-label">
                                        {option.label}
                                    </span>

                                    {isSelected && (
                                        <Check
                                            className="board-cell-status-check"
                                            size={15}
                                            strokeWidth={2.5}
                                        />
                                    )}
                                </button>
                            )
                        })}

                        <div className="board-cell-status-menu-divider" />

                        <button
                            type="button"
                            className="board-cell-status-menu-item clear"
                            aria-pressed={value === ''}
                            disabled={saving}
                            onClick={() => handleCommit('')}
                        >
                            <span className="board-cell-status-icon">
                                <CircleMinus size={14} strokeWidth={2} />
                            </span>

                            <span className="board-cell-status-menu-label">
                                Sem status
                            </span>

                            {value === '' && (
                                <Check
                                    className="board-cell-status-check"
                                    size={15}
                                />
                            )}
                        </button>
                    </div>,
                    document.body
                )}
            </>
        )
    }

    if (!value) {
        return (
            <EmptyCell
                column={column}
                onClick={handleStartEditing}
            />
        )
    }

    const displayStatus = selectedStatus ?? {
        label: value,
        className: 'unknown',
        Icon: CircleHelp
    }

    return (
        <button
            type="button"
            className={`board-cell board-cell-status-value ${displayStatus.className}`}
            onClick={handleStartEditing}
            title={`Alterar ${column.name}`}
            aria-label={`${column.name}: ${displayStatus.label}. Clique para alterar.`}
        >
            {renderStatusIndicator(displayStatus)}
        </button>
    )
}
