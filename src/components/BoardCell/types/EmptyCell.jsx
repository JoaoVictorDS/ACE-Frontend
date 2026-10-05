import { Plus } from 'lucide-react'
import './EmptyCell.css'

export const EmptyCell = ({ column, onClick }) => (
    <button
        type="button"
        className="board-cell board-cell-empty"
        onClick={onClick}
        aria-label={`Editar ${column.name} `}
        title={`Adicionar ${column.name} `}
    >
        <span className="board-cell-empty-icon">
            <Plus size={14} strokeWidth={2} />
        </span>
    </button>
)
