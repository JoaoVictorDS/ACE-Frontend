import { Check } from 'lucide-react'
import { USER_AVAILABILITY_OPTIONS } from '../../constants/userAvailability'
import './UserAvailabilityMenu.css'

export const UserAvailabilityMenu = ({ value, onChange }) => {
    return (
        <div className="user-availability-menu">
            <span className="user-availability-menu-title">
                Disponibilidade
            </span>

            <div className="user-availability-options">
                {USER_AVAILABILITY_OPTIONS.map((option) => {
                    const selected = value === option.value

                    return (
                        <button
                            key={option.value}
                            type="button"
                            className={`user-availability-option ${selected ? 'selected' : ''}`}
                            aria-pressed={selected}
                            onClick={() => onChange(option.value)}
                        >
                            <span
                                className={`user-availability-dot availability-${option.value.toLowerCase()}`}
                            />

                            <span className="user-availability-option-label">
                                {option.label}
                            </span>

                            {selected && (
                                <Check size={15} strokeWidth={2} />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}