import { useEffect, useRef, useState } from 'react'
import './AddItemRow.css'

export const AddItemRow = ({ open, onOpen, onClose, onCreate, creating = false }) => {
    const [title, setTitle] = useState('')
    const inputRef = useRef(null)
    const containerRef = useRef(null)

    useEffect(() => {
        if (!open) return

        inputRef.current?.focus()
        inputRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })
    }, [open])

    useEffect(() => {
        if (!open) return

        const handlePointerDown = (event) => {
            if (!containerRef.current?.contains(event.target)) {
                onClose()
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
        }
    }, [open, onClose])

    const handleCancel = () => {
        if (creating) return

        setTitle('')
        onClose()
    }

    const handleCreate = async () => {
        const trimmedTitle = title.trim()

        if (!trimmedTitle) {
            setTitle('')
            onClose()
            return
        }

        if (creating) return

        try {
            await onCreate(trimmedTitle)

            setTitle('')
            onClose()
        } catch {
            // Mantém o campo aberto caso a criação falhe
        }
    }

    const handleKeyDown = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            await handleCreate()
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            handleCancel()
        }
    }

    if (!open) {
        return (
            <button
                type="button"
                className="board-add-item"
                onClick={onOpen}
                disabled={creating}
            >
                <span>+ Novo item</span>
            </button>
        )
    }

    return (
        <div
            ref={containerRef}
            className="board-add-item board-add-item-editing"
        >
            <input
                ref={inputRef}
                type="text"
                value={title}
                placeholder={`Nome do ${'item'}`}
                disabled={creating}
                onChange={(event) => setTitle(event.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Nome do novo item"
            />

            {creating && (
                <span className="board-add-item-status">
                    Criando...
                </span>
            )}
        </div>
    )
}