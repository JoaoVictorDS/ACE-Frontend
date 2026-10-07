import { useEffect, useMemo, useRef } from 'react'
import { Check, X } from 'lucide-react'
import { EmptyCell } from './EmptyCell'
import { UserAvatar } from '../../UserAvatar/UserAvatar'
import './UserCell.css'

const parseIds = (value) => (value || '').split(',').map((id) => Number(id.trim())).filter(Boolean)

export const UserCell = ({ value, setValue, initialValue, editing, saving, users, column, handleStartEditing, handleCancel, handleCommit }) => {
    const containerRef = useRef(null)

    const usersData = useMemo(() => users.map(({ user }) => user), [users])
    const selectedUserIds = useMemo(() => parseIds(value), [value])
    const initialUserIds = useMemo(() => parseIds(initialValue), [initialValue])

    useEffect(() => {
        if (!editing || saving) return

        const handlePointerDown = (event) => {
            if (!containerRef.current?.contains(event.target)) {
                handleCancel()
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
        }
    }, [editing, saving, handleCancel])

    const handleToggleUser = (userId, checked) => {
        if (saving) return

        const newUserIds = checked
            ? [...selectedUserIds, userId]
            : selectedUserIds.filter((id) => id !== userId)

        setValue(newUserIds.join(', '))
    }

    if (editing) {
        return (
            <div
                ref={containerRef}
                className="board-cell board-cell-user-editing"
            >
                <div className="board-cell-user-options">
                    {usersData.map((user) => {
                        const selected = selectedUserIds.includes(user.id)

                        return (
                            <label
                                key={user.id}
                                className={`board-cell-user-option ${selected ? 'selected' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected}
                                    disabled={saving}
                                    onChange={(event) => handleToggleUser(user.id, event.target.checked)}
                                />

                                <span className="board-cell-user-option-avatar">
                                    <UserAvatar user={user} />
                                </span>

                                <span className="board-cell-user-option-name">{user.name}</span>
                            </label>
                        )
                    })}
                </div>

                <div className="board-cell-user-actions">
                    <button
                        type="button"
                        disabled={saving}
                        onClick={handleCommit}
                    >
                        <Check size={14} />
                        Salvar
                    </button>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={handleCancel}
                    >
                        <X size={14} />
                        Cancelar
                    </button>
                </div>
            </div>
        )
    }

    if (!initialValue) return <EmptyCell column={column} onClick={handleStartEditing} />

    return (
        <button
            type="button"
            className="board-cell board-cell-users"
            onClick={handleStartEditing}
            title="Clique para editar"
        >
            {initialUserIds.map((userId) => {
                const user = usersData.find((u) => u.id === userId)
                if (!user) return null

                return (
                    <UserAvatar
                        user={user}
                        key={userId}
                    />
                )
            })}
        </button>
    )
}