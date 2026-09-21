import './TaskItem.css'

export const TaskItem = ({ status, title, board, date, dateClassName = '' }) => {
    return (
        <article className="task-item">
            <span
                className={`task-status task-status--${status}`}
                aria-label={`Status: ${status}`}
            />

            <div className="task-info">
                <strong className="task-title">
                    {title}
                </strong>

                <span className="task-board">
                    {board}
                </span>
            </div>

            <span className={`task-date ${dateClassName}`}>
                {date}
            </span>
        </article>
    )
}
