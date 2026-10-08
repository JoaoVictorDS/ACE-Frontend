import { useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Ellipsis, Trash2 } from 'lucide-react'
import './BoardItemMenu.css'

const MENU_GAP = 6
const VIEWPORT_PADDING = 8

export const BoardItemMenu = ({ item, onDelete, children, gridTemplateColumns }) => {
    const [open, setOpen] = useState(false)
    const [anchor, setAnchor] = useState(null)
    const [position, setPosition] = useState(null)

    const handleOpenFromButton = (event) => {
        event.stopPropagation()

        if (open) {
            setOpen(false)
            return
        }

        const rect = event.currentTarget.getBoundingClientRect()

        setAnchor({
            x: rect.right,
            y: rect.bottom,
            type: 'button'
        })

        setPosition({
            top: rect.bottom + MENU_GAP,
            left: rect.right
        })

        setOpen(true)
    }

    const handleContextMenu = (event) => {
        event.preventDefault()
        event.stopPropagation()

        setAnchor({
            x: event.clientX,
            y: event.clientY,
            type: 'cursor'
        })

        setPosition({
            top: event.clientY,
            left: event.clientX
        })

        setOpen(true)
    }

    const handleDelete = () => {
        setOpen(false)
        onDelete(item)
    }

    useEffect(() => {
        if (!open) return

        const handlePointerDown = (event) => {
            if (event.target.closest('.board-item-menu-dropdown')) {
                return
            }

            setOpen(false)
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setOpen(false)
            }
        }

        const handleScroll = () => {
            setOpen(false)
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('keydown', handleKeyDown)
        window.addEventListener('scroll', handleScroll, true)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('scroll', handleScroll, true)
        }
    }, [open])

    useLayoutEffect(() => {
        if (!open || !anchor || !position) return

        const menu = document.querySelector('.board-item-menu-dropdown')

        if (!menu) return

        const menuRect = menu.getBoundingClientRect()

        let top = anchor.y
        let left = anchor.x

        if (anchor.type === 'button') {
            top = anchor.y
            left = anchor.x - menuRect.width
        }

        if (top + menuRect.height > window.innerHeight - VIEWPORT_PADDING) {
            top = anchor.type === 'button'
                ? anchor.y - menuRect.height - MENU_GAP
                : anchor.y - menuRect.height
        }

        if (left + menuRect.width > window.innerWidth - VIEWPORT_PADDING) {
            left = window.innerWidth - menuRect.width - VIEWPORT_PADDING
        }

        if (left < VIEWPORT_PADDING) {
            left = VIEWPORT_PADDING
        }

        if (top < VIEWPORT_PADDING) {
            top = VIEWPORT_PADDING
        }

        setPosition({
            top,
            left
        })
    }, [open, anchor])

    return (
        <div
            className="board-item-menu-container"
            onContextMenu={handleContextMenu}
        >
            <div
                className="board-item-row"
                style={{ gridTemplateColumns }}
            >
                {children}

                <div className="board-item-menu-cell">
                    <button
                        type="button"
                        className="board-item-more"
                        aria-label={`Mais opções de ${item.title}`}
                        aria-haspopup="menu"
                        aria-expanded={open}
                        onClick={handleOpenFromButton}
                    >
                        <Ellipsis size={16} />
                    </button>
                </div>
            </div>

            {open && position && createPortal(
                <div
                    className="board-item-menu-dropdown"
                    role="menu"
                    style={{
                        top: position.top,
                        left: position.left
                    }}
                >
                    <button
                        type="button"
                        className="board-item-menu-option board-item-menu-option-danger"
                        role="menuitem"
                        onClick={handleDelete}
                    >
                        <Trash2 size={15} />
                        Excluir item
                    </button>
                </div>,
                document.body
            )}
        </div>
    )
}