import './Input.css'

export const Input = ({
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    disabled = false,
    required = false,
    className = '',
    ...props
}) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`

    return (
        <div className="input-group">
            {label && (
                <label className="input-label" htmlFor={inputId}>
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${inputId}-error` : undefined}
                className={`input ${error ? 'input-error' : ''} ${className}`}
                {...props}
            />
            {error && (
                <span id={`${inputId}-error`} className="input-error-message" role="alert">
                    {error}
                </span>
            )}
        </div >
    )
} 