import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Ellipsis, Trash2 } from 'lucide-react'
import './BoardItemMenu.css'

const MENU_GAP = 6
const VIEWPORT_PADDING = 8

export const BoardItemMenu = ({ item, onDelete, children }) => {
    const [open, setOpen] = useState(false)
    const [anchor, setAnchor] = useState(null)
    const [position, setPosition] = useState(null)

    const buttonRef = useRef(null)
    const menuRef = useRef(null)

    const handleButtonClick = (event) => {
        event.stopPropagation()

        if (open) {
            setOpen(false)
            return
        }

        const rect = event.currentTarget.getBoundingClientRect()
        const nextAnchor = {
            x: rect.right,
            y: rect.bottom + MENU_GAP,
            buttonTop: rect.top,
            type: 'button'
        }

        setAnchor(nextAnchor)
        setPosition({
            top: nextAnchor.y,
            left: nextAnchor.x
        })
        setOpen(true)
    }

    const handleContextMenu = (event) => {
        event.preventDefault()
        event.stopPropagation()

        const nextAnchor = {
            x: event.clientX,
            y: event.clientY,
            type: 'cursor'
        }

        setAnchor(nextAnchor)
        setPosition({
            top: nextAnchor.y,
            left: nextAnchor.x
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
            if (
                buttonRef.current?.contains(event.target) ||
                menuRef.current?.contains(event.target)
            ) {
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
        if (!open || !anchor || !menuRef.current) return

        const rect = menuRef.current.getBoundingClientRect()

        let left = anchor.type === 'button'
            ? anchor.x - rect.width
            : anchor.x

        let top = anchor.y

        if (top + rect.height > window.innerHeight - VIEWPORT_PADDING) {
            top = anchor.type === 'button'
                ? anchor.buttonTop - rect.height - MENU_GAP
                : anchor.y - rect.height
        }

        left = Math.max(
            VIEWPORT_PADDING,
            Math.min(left, window.innerWidth - rect.width - VIEWPORT_PADDING)
        )

        top = Math.max(
            VIEWPORT_PADDING,
            Math.min(top, window.innerHeight - rect.height - VIEWPORT_PADDING)
        )

        setPosition((current) => {
            if (current?.top === top && current?.left === left) {
                return current
            }

            return { top, left }
        })
    }, [open, anchor])

    const menuTrigger = (
        <div className="board-item-menu-cell">
            <button
                ref={buttonRef}
                data-no-drag
                type="button"
                className="board-item-more"
                aria-label={`Mais opções de ${item.title}`}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={handleButtonClick}
            >
                <Ellipsis size={16} />
            </button>
        </div>
    )

    return (
        <>
            {children({
                onContextMenu: handleContextMenu,
                menuTrigger
            })}

            {open && position && createPortal(
                <div
                    ref={menuRef}
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
        </>
    )
}