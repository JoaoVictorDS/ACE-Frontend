
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check } from 'lucide-react'
import { EmptyCell } from './EmptyCell'
import './SelectCell.css'

export const SelectCell = ({ value, initialValue, editing, saving, inputRef, handleStartEditing, handleCancel, handleCommit, column }) => {
    const anchorRef = useRef(null)
    const menuRef = useRef(null)

    const [menuPosition, setMenuPosition] = useState(null)

    const options = Array.isArray(column.options) ? column.options : []

    const isMenuPositioned = menuPosition !== null
    const selectedIndex = options.findIndex((option) => option === value)
    const focusIndex = Math.max(selectedIndex, 0)

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

    if (editing) {
        return (
            <>
                <button
                    ref={anchorRef}
                    type="button"
                    className="board-cell board-cell-select-editing"
                    aria-label={`Fechar edição de ${column.name}`}
                    onClick={handleCancel}
                />

                {createPortal(
                    <div
                        ref={menuRef}
                        className="board-cell-select-menu"
                        style={{
                            top: menuPosition?.top ?? 0,
                            left: menuPosition?.left ?? 0,
                            maxHeight: menuPosition?.maxHeight ?? 'calc(100vh - 16px)',
                            visibility: menuPosition ? 'visible' : 'hidden'
                        }}
                        role="group"
                        aria-label={`Selecionar ${column.name}`}
                    >
                        <div className="board-cell-select-menu-header">
                            Alterar {column.name}
                        </div>

                        {options.map((option, index) => {
                            const isSelected = option === value

                            return (
                                <button
                                    key={`${option}-${index}`}
                                    ref={index === focusIndex ? inputRef : null}
                                    type="button"
                                    aria-pressed={isSelected}
                                    aria-label={`${option}${isSelected ? ', selecionada' : ''}`}
                                    className={`board-cell-select-menu-item ${isSelected ? 'is-selected' : ''}`}
                                    disabled={saving}
                                    onClick={() => handleCommit(option)}
                                >
                                    <span className="board-cell-select-menu-label">
                                        {option}
                                    </span>

                                    {isSelected && (
                                        <Check
                                            className="board-cell-select-check"
                                            size={15}
                                            strokeWidth={2.5}
                                        />
                                    )}
                                </button>
                            )
                        })}

                        <div className="board-cell-select-menu-divider" />

                        <button
                            type="button"
                            className="board-cell-select-menu-item clear"
                            aria-pressed={value === ''}
                            disabled={saving}
                            onClick={() => handleCommit('')}
                        >
                            <span className="board-cell-select-menu-label">
                                Sem seleção
                            </span>

                            {value === '' && (
                                <Check
                                    className="board-cell-select-check"
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

    if (!initialValue) {
        return (
            <EmptyCell
                column={column}
                onClick={handleStartEditing}
            />
        )
    }

    return (
        <button
            type="button"
            className="board-cell board-cell-select-value"
            onClick={handleStartEditing}
            title="Clique para editar"
        >
            <span className="board-cell-select-badge" title={initialValue}>
                <span className="board-cell-select-text">
                    {initialValue}
                </span>
            </span>
        </button>
    )
}
