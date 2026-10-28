import { useEffect, useRef, useState } from 'react'

export const useResize = ({ onResize, onCommit }) => {
    const [resizingId, setResizingId] = useState(null)
    const resizeRef = useRef(null)

    useEffect(() => {
        if (!resizingId) return

        document.body.classList.add('is-resizing')

        return () => {
            document.body.classList.remove('is-resizing')
        }
    }, [resizingId])

    const handlePointerDown = (
        event,
        { id, value, previousValue = value, min, max }
    ) => {
        event.preventDefault()
        event.stopPropagation()

        event.currentTarget.setPointerCapture(event.pointerId)

        const startValue = Math.round(value)

        resizeRef.current = {
            id,
            pointerId: event.pointerId,
            startX: event.clientX,
            startValue,
            currentValue: startValue,
            previousValue,
            min,
            max,
        }

        setResizingId(id)
    }

    const handlePointerMove = (event) => {
        const resize = resizeRef.current

        if (!resize || resize.pointerId !== event.pointerId) {
            return
        }

        const newValue = Math.round(
            Math.min(
                resize.max,
                Math.max(
                    resize.min,
                    resize.startValue + (event.clientX - resize.startX)
                )
            )
        )

        resize.currentValue = newValue

        onResize({
            id: resize.id,
            value: newValue,
        })
    }

    const finishResize = async (event, commit) => {
        const resize = resizeRef.current

        if (!resize || resize.pointerId !== event.pointerId) {
            return
        }

        resizeRef.current = null
        setResizingId(null)

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }

        const restorePreviousValue = () => {
            onResize({
                id: resize.id,
                value: resize.previousValue,
            })
        }

        if (!commit) {
            restorePreviousValue()
            return
        }

        if (resize.currentValue === resize.startValue) {
            return
        }

        try {
            await onCommit({
                id: resize.id,
                value: resize.currentValue,
                initialValue: resize.startValue,
            })
        } catch {
            restorePreviousValue()
        }
    }

    return {
        resizingId,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp: (event) => void finishResize(event, true),
        handlePointerCancel: (event) => void finishResize(event, false),
    }
}