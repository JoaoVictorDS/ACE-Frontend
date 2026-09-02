export const TaskItem = ({
    status,
    title,
    board,
    date,
    dateClassName = '',
}) => {
    return (
        <div className="task-item">
            <div className={`task-status ${status}`}></div>

            <div className="task-info">
                <strong>{title}</strong>

                <span>{board}</span>
            </div>

            <span className={`task-date ${dateClassName}`}>
                {date}
            </span>
        </div>
    )
}
