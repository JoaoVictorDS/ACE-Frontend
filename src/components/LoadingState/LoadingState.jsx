import { Loader2 } from 'lucide-react'
import './LoadingState.css'

export const LoadingState = ({ message = 'Carregando...' }) => {
    return (
        <div className="loading-state">
            <Loader2
                className="loading-state-icon"
                size={24}
                strokeWidth={2}
            />
            <span>{message}</span>
        </div>
    )
}