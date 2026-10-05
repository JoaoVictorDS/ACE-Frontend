import { useEffect } from 'react'
import { useSocket } from '../../hooks/useSocket'
import { useQueryClient } from '@tanstack/react-query'
import { dispatchBoardChange } from './BoardChangeDispatcher'

export const BoardSocketListener = ({ boardId }) => {
    const queryClient = useQueryClient()

    const { socket } = useSocket()

    useEffect(() => {
        if (!socket || !boardId) {
            return
        }

        const handleDomainChanged = (event) => {
            dispatchBoardChange({ queryClient, boardId, event })
        }

        socket.emit('board:join', boardId)

        socket.on('domain:changed', handleDomainChanged)

        return () => {
            socket.off('domain:changed', handleDomainChanged)
            socket.emit('board:leave', boardId)
        }
    }, [socket, boardId, queryClient])

    return null
}