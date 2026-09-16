import './Select.css'

export const Select = ({
    id,
    name,
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Selecione uma opção',
}) => {
    return (
        <div className="select-field">
            {label && (
                <label htmlFor={id}>
                    {label}
                </label>
            )}

            <select
                id={id}
                name={name}
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
            >
                <option value="">
                    {placeholder}
                </option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}