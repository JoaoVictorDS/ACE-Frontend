import './Toggle.css'

export const Toggle = ({
    title,
    description,
    enabled,
    onChange,
}) => {
    return (
        <div className="toggle-row">
            <div className="toggle-info">
                <strong>{title}</strong>

                {description && (
                    <p>{description}</p>
                )}
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                className={`toggle ${enabled ? 'active' : ''}`}
                onClick={() => onChange(!enabled)}
            >
                <span className="toggle-thumb" />
            </button>
        </div>
    )
}
