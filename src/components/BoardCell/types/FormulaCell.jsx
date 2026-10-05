export const FormulaCell = ({ initialValue }) => (
    <div className="board-cell">
        <span className="board-cell-text" title={initialValue}>
            {initialValue || '—'}
        </span>
    </div>
)