import { LayoutGrid, MoreHorizontal } from 'lucide-react'
import './BoardCard.css'

export const BoardCard = ({ board, onClick, onMenuClick }) => {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onClick(board)
        }
    }

    return (
        <article
            className="board-card"
            role="button"
            tabIndex={0}
            onClick={() => onClick(board)}
            onKeyDown={handleKeyDown}
        >
            <div
                className="board-card-color"
                style={{
                    backgroundColor: board.color
                }}
            />

            <div className="board-card-content">
                <div className="board-card-header">
                    <div className="board-card-title">
                        <span className="board-card-icon">
                            <LayoutGrid
                                size={18}
                                strokeWidth={2}
                            />
                        </span>

                        <h4>{board.name}</h4>
                    </div>

                    <button
                        type="button"
                        className="board-card-menu"
                        aria-label={`Ações do board ${board.name}`}
                        onClick={(event) => {
                            event.stopPropagation()

                            // TODO: Abrir menu de ações
                            // TODO: Exemplo:
                            // onMenuClick?.(board)
                        }}
                    >
                        <MoreHorizontal
                            size={18}
                            strokeWidth={2}
                        />
                    </button>
                </div>

                <p>
                    {board.description || 'Sem descrição'}
                </p>

                <div className="board-card-footer">
                    <span>
                        {board.tasks ?? 0} tarefas
                    </span>

                    <span>
                        {board.pending ?? 0} pendentes
                    </span>
                </div>
            </div>
        </article>
    )
}