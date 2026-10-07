import { useEffect, useRef, useState } from 'react'
import { Ellipsis, Trash2 } from 'lucide-react'
import './BoardItemMenu.css'

export const BoardItemMenu = ({ item, onDelete }) => {
    const [open, setOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        if (!open) return

        const handlePointerDown = (event) => {
            if (!menuRef.current?.contains(event.target)) {
                setOpen(false)
            }
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setOpen(false)
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [open])

    const handleDelete = () => {
        setOpen(false)
        onDelete(item)
    }

    return (
        <div
            ref={menuRef}
            className="board-item-menu"
        >
            <button
                type="button"
                className="board-item-more"
                aria-label={`Mais opções de ${item.title}`}
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
            >
                <Ellipsis size={16} />
            </button>

            {open && (
                <div className="board-item-menu-dropdown">
                    <button
                        type="button"
                        className="board-item-menu-option board-item-menu-option-danger"
                        onClick={handleDelete}
                    >
                        <Trash2 size={15} />
                        Excluir item
                    </button>
                </div>
            )}
        </div>
    )
}