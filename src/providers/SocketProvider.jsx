import { useEffect } from 'react'
import { SocketContext } from '../contexts/SocketContext'
import { useAuth } from '../hooks/useAuth'
import { connectSocket, disconnectSocket, getSocket } from '../socket'

export const SocketProvider = ({ children }) => {
    const { isAuthenticated, initializing } = useAuth()

    useEffect(() => {
        if (initializing) {
            return
        }

        if (!isAuthenticated) {
            disconnectSocket()
            return
        }

        connectSocket()

        return () => {
            disconnectSocket()
        }
    }, [isAuthenticated, initializing])

    return (
        <SocketContext.Provider value={{
            socket: getSocket()
        }}>{children}</SocketContext.Provider>
    )
}