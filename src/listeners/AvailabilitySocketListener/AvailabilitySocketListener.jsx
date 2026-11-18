
import { useEffect } from 'react'
import { useSocket } from '../../hooks/useSocket'
import { useQueryClient } from '@tanstack/react-query'

export const AvailabilitySocketListener = () => {
    const queryClient = useQueryClient()

    const { socket } = useSocket()

    useEffect(() => {
        if (!socket) {
            return
        }

        const invalidateAvailability = () => {
            void queryClient.invalidateQueries({
                queryKey: ['availability']
            })
        }

        const handleDomainChanged = (event) => {
            if (event?.entityType !== 'USER_AVAILABILITY_DAY') {
                return
            }

            invalidateAvailability()
        }

        socket.on('domain:changed', handleDomainChanged)
        socket.on('connect', invalidateAvailability)

        invalidateAvailability()

        return () => {
            socket.off('domain:changed', handleDomainChanged)
            socket.off('connect', invalidateAvailability)
        }
    }, [socket, queryClient])

    return null
}
