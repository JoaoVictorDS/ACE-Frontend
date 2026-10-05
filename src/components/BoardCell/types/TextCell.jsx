import { EmptyCell } from './EmptyCell'

export const TextCell = ({ value, setValue, initialValue, editing, saving, inputRef, handleStartEditing, handleCommit, handleKeyDown, column }) => {
    if (editing) {
        return (
            <div className="board-cell board-cell-editing">
                <input
                    ref={inputRef} type="text" className="board-cell-input"
                    value={value} disabled={saving}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => { if (!saving) handleCommit() }}
                    aria-label={`Editar ${column.name}`}
                />
            </div>
        )
    }
    if (!initialValue) return <EmptyCell column={column} onClick={handleStartEditing} />

    return (
        <button type="button" className="board-cell" onClick={handleStartEditing} title="Clique para editar">
            <span className="board-cell-text" title={initialValue}>{initialValue}</span>
        </button>
    )
}