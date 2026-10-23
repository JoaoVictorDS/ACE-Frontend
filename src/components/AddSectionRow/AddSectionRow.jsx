
import { useEffect, useRef, useState } from 'react'
import './AddSectionRow.css'

export const AddSectionRow = ({ open, onOpen, onClose, onCreate, creating = false }) => {
    const [name, setName] = useState('')
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

        setName('')
        onClose()
    }

    const handleCreate = async () => {
        const trimmedName = name.trim()

        if (!trimmedName) {
            setName('')
            onClose()
            return
        }

        if (creating) return

        try {
            await onCreate(trimmedName)

            setName('')
            onClose()
        } catch {
            // Mantém o campo aberto caso a criação falhe.
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
            <div className="board-add-section-row">
                <button
                    type="button"
                    className="board-add-section"
                    onClick={onOpen}
                    disabled={creating}
                >
                    <span>+ Nova seção</span>
                </button>
            </div>
        )
    }

    return (
        <div className="board-add-section-row">
            <div
                ref={containerRef}
                className="board-add-section board-add-section-editing"
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    placeholder="Nome da seção"
                    disabled={creating}
                    onChange={(event) => setName(event.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="Nome da nova seção"
                />

                {creating && (
                    <span className="board-add-section-status">
                        Criando...
                    </span>
                )}
            </div>
        </div>
    )
}
