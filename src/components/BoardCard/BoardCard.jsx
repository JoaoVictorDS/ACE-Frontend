import './BoardCard.css'

export const BoardCard = ({ color, title, description, tasks, pending }) => {
    return (
        <div className="board-card">
            <div className={`board-card-color ${color}`}></div>

            <div className="board-card-content">
                <div className="board-card-header">
                    <h4>{title}</h4>

                    <button type="button">
                        •••
                    </button>
                </div>

                <p>
                    {description}
                </p>

                <div className="board-card-footer">
                    <span>{tasks} tarefas</span>
                    <span>{pending} pendentes</span>
                </div>
            </div>
        </div>
    )
}
