import './Input.css'

export const Input = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    className = '',
    ...props
}) => {
    return (
        <div className="input-group">
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`input ${error ? 'input-error' : ''} ${className}`}
                {...props}
            />
            {error && <span className="input-error-message">{error}</span>}
        </div>
    )
} 