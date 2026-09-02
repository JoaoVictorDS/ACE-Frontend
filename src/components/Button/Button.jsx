import './Button.css'

export const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-${variant} btn-${size} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}