import { EmptyCell } from './EmptyCell'

export const LongTextCell = ({ value, setValue, initialValue, editing, saving, inputRef, handleStartEditing, handleCommit, handleKeyDown, column }) => {
    if (editing) {
        return (
            <div className="board-cell board-cell-editing">
                <textarea
                    ref={inputRef} className="board-cell-input board-cell-long-text-input"
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
            <span className="board-cell-long-text" title={initialValue}>{initialValue}</span>
        </button>
    )
}