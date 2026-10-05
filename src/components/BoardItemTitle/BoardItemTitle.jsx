import { useEffect, useRef, useState } from 'react'
import { MessageSquareText } from 'lucide-react'
import './BoardItemTitle.css'

export const BoardItemTitle = ({ item, onCommit, onOpen }) => {
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(item.title)
    const inputRef = useRef(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!editing) {
            setValue(item.title)
        }
    }, [item.title, editing])

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [editing])

    const handleStartEditing = () => {
        if (saving) return

        setValue(item.title)
        setEditing(true)
    }

    const handleCancel = () => {
        setValue(item.title)
        setEditing(false)
    }

    const handleCommit = async () => {
        if (saving) return

        const nextValue = value.trim()

        if (!nextValue) {
            setValue(item.title)
            setEditing(false)
            return
        }

        if (nextValue === item.title) {
            setEditing(false)
            return
        }

        try {
            setSaving(true)

            await onCommit(item, nextValue)

            setEditing(false)
        } catch {
            // Mantém a edição aberta para o usuário tentar novamente.
        } finally {
            setSaving(false)
        }
    }

    const handleKeyDown = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            await handleCommit()
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            handleCancel()
        }
    }

    return (
        <div className="board-item-title">
            {editing ? (
                <input
                    ref={inputRef}
                    type="text"
                    className="board-item-title-input"
                    value={value}
                    disabled={saving}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => { if (!saving) handleCommit() }}
                    aria-label={`Editar ${item.title}`}
                />
            ) : (
                <button
                    type="button"
                    className="board-item-title-edit"
                    onClick={handleStartEditing}
                >
                    <span className="board-item-title-dot" />

                    <span
                        className="board-item-title-text"
                        title={item.title}
                    >
                        {item.title}
                    </span>
                </button>
            )}

            <button
                type="button"
                className="board-item-updates"
                onClick={(event) => {
                    event.stopPropagation()
                    onOpen(item)
                }}
                title="Ver updates e comentários"
                aria-label={`Ver updates e comentários de ${item.title}`}
            >
                <MessageSquareText size={15} strokeWidth={2} />
            </button>
        </div>
    )
}