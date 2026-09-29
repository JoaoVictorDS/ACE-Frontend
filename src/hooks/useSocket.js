import { useContext } from 'react'
import { SocketContext } from '../contexts/SocketContext'

export const useSocket = () => {
    const context = useContext(SocketContext)

    if (!context) {
        throw new Error('useContext deve ser usado dentro de SocketProvider')
    }

    return context
}