import { io } from 'socket.io-client'
import { STORAGE_KEYS } from './constants/storageKeys'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

const URL = import.meta.env.VITE_NODE_ENV === 'production' ? undefined : SOCKET_URL

const socket = io(URL, {
    autoConnect: false,
    auth: {
        token: null
    }
})

export const connectSocket = () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

    if (!token) return

    socket.auth = {
        token
    }

    if (socket.disconnected) {
        socket.connect()
    }
}

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect()
    }
}

export const getSocket = () => {
    return socket
}