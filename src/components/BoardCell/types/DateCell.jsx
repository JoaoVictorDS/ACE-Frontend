import { CalendarDays } from 'lucide-react'
import { EmptyCell } from './EmptyCell'
import './DateCell.css'

export const formatDateForInput = (value) => {
    return value ? value.slice(0, 10) : ''
}

export const formatDateForDisplay = (value) => {
    if (!value) return '—'

    const [year, month, day] = value.slice(0, 10).split('-')

    return `${day}/${month}/${year}`
}

export const DateCell = ({ value, setValue, initialValue, editing, saving, inputRef, handleStartEditing, handleCommit, handleKeyDown, column }) => {
    if (editing) {
        return (
            <div className="board-cell board-cell-date-editing">
                <div className="board-cell-date-input-wrapper">
                    <CalendarDays size={15} strokeWidth={2} />

                    <input
                        ref={inputRef}
                        type="date"
                        className="board-cell-date-input"
                        value={formatDateForInput(value)}
                        disabled={saving}
                        onChange={(event) => setValue(event.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => { if (!saving) handleCommit() }}
                        aria-label={`Editar ${column.name}`}
                    />
                </div>
            </div>
        )
    }

    if (!initialValue) return <EmptyCell column={column} onClick={handleStartEditing} />

    return (
        <button
            type="button"
            className="board-cell board-cell-date"
            onClick={handleStartEditing}
            title="Clique para editar"
        >
            <CalendarDays size={14} strokeWidth={2} />

            <span className="board-cell-date-text">
                {formatDateForDisplay(initialValue)}
            </span>
        </button>
    )
}