import { ChevronDown } from 'lucide-react'
import { EmptyCell } from './EmptyCell'
import './SelectCell.css'

export const SelectCell = ({ value, setValue, initialValue, editing, saving, inputRef, handleStartEditing, handleCommit, handleKeyDown, column }) => {
    if (editing) {
        return (
            <div className="board-cell board-cell-select-editing">
                <div className="board-cell-select-wrapper">
                    <select
                        ref={inputRef}
                        className="board-cell-select-input"
                        value={value}
                        disabled={saving}
                        onChange={(event) => setValue(event.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => { if (!saving) handleCommit() }}
                        aria-label={`Editar ${column.name}`}
                    >
                        <option value="">Selecione...</option>

                        {column.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <ChevronDown
                        className="board-cell-select-icon"
                        size={14}
                        strokeWidth={2}
                    />
                </div>
            </div>
        )
    }

    if (!initialValue) return <EmptyCell column={column} onClick={handleStartEditing} />

    return (
        <button
            type="button"
            className="board-cell board-cell-select-value"
            onClick={handleStartEditing}
            title="Clique para editar"
        >
            <span className="board-cell-select-badge" title={initialValue}>
                <span className="board-cell-select-text">{initialValue}</span>
            </span>
        </button>
    )
}