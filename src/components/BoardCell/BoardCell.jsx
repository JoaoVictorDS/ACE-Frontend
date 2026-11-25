import { useEffect, useRef, useState } from 'react'
import { FormulaCell } from './types/FormulaCell'
import { LongTextCell } from './types/LongTextCell'
import { NumberCell } from './types/NumberCell'
import { DateCell } from './types/DateCell'
import { SelectCell } from './types/SelectCell'
import { UserCell } from './types/UserCell'
import { TextCell } from './types/TextCell'
import { StatusCell } from './types/StatusCell'
import './BoardCell.css'

export const BoardCell = ({ column, item, users, onCommit }) => {
    const itemValue = item.item_values?.find((v) => v.column_id === column.id)
    const initialValue = itemValue?.value ?? ''

    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(initialValue)
    const [saving, setSaving] = useState(false)

    const inputRef = useRef(null)

    useEffect(() => {
        if (!editing) {
            setValue(itemValue?.value ?? '')
        }
    }, [itemValue?.value, editing])

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus()

            if (!['SELECT', 'STATUS'].includes(column.data_type)) {
                inputRef.current?.select()
            }
        }
    }, [editing, column.data_type])

    const handleStartEditing = () => {
        if (saving || column.data_type === 'FORMULA') return
        setValue(itemValue?.value ?? '')
        setEditing(true)
    }

    const handleCancel = () => {
        setValue(itemValue?.value ?? '')
        setEditing(false)
    }


    const handleCommit = async (nextValue = value) => {
        if (saving) return

        if (nextValue === initialValue) {
            setEditing(false)
            return
        }

        try {
            setValue(nextValue)
            setSaving(true)

            await onCommit({ item, column, value: nextValue })

            setEditing(false)
        } catch {
            // Mantém em edição caso falhe
        } finally {
            setSaving(false)
        }
    }

    const handleKeyDown = async (event) => {
        if (event.key === 'Enter') {

            if (event.shiftKey) return
            event.preventDefault()
            await handleCommit()
        }
        if (event.key === 'Escape') {
            event.preventDefault()
            handleCancel()
        }
    }

    const cellProps = {
        value, setValue, initialValue, editing, saving, inputRef, users, column, handleStartEditing, handleCancel, handleCommit, handleKeyDown
    }

    switch (column.data_type) {
        case 'FORMULA': return <FormulaCell {...cellProps} />
        case 'LONG_TEXT': return <LongTextCell {...cellProps} />
        case 'NUMBER': return <NumberCell {...cellProps} />
        case 'DATE': return <DateCell {...cellProps} />
        case 'STATUS': return <StatusCell {...cellProps} />
        case 'SELECT': return <SelectCell {...cellProps} />
        case 'USER': return <UserCell {...cellProps} />
        case 'TEXT':
        default: return <TextCell {...cellProps} />
    }
}