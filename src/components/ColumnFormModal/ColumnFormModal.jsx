import { useEffect, useId, useRef, useState } from 'react'
import { Columns3, X } from 'lucide-react'
import { Button } from '../Button/Button'
import { FormFeedback } from '../FormFeedback/FormFeedback'
import { getErrorMessage } from '../../utils/error'
import './ColumnFormModal.css'

const COLUMN_TYPES = [
    { value: 'TEXT', label: 'Texto' },
    { value: 'LONG_TEXT', label: 'Texto longo' },
    { value: 'NUMBER', label: 'Número' },
    { value: 'DATE', label: 'Data' },
    { value: 'SELECT', label: 'Seleção' },
    { value: 'USER', label: 'Usuário' },
    { value: 'FORMULA', label: 'Fórmula' }
]

export const ColumnFormModal = ({ column = null, onSubmit, onClose }) => {
    const dialogRef = useRef(null)
    const nameInputRef = useRef(null)

    const titleId = useId()
    const nameId = useId()
    const dataTypeId = useId()
    const optionsId = useId()
    const formulaId = useId()
    const descriptionId = useId()

    const [name, setName] = useState(column?.name ?? '')
    const [dataType, setDataType] = useState(column?.data_type ?? 'TEXT')
    const [optionsText, setOptionsText] = useState(column?.options?.join('\n') ?? '')
    const [formulaExpression, setFormulaExpression] = useState(column?.formula_expression ?? '')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)

    const isEditing = Boolean(column)

    useEffect(() => {
        const dialog = dialogRef.current

        if (dialog && !dialog.open) {
            dialog.showModal()
        }

        return () => {
            if (dialog?.open) {
                dialog.close()
            }
        }
    }, [])

    const handleClose = () => {
        if (!isSubmitting) {
            onClose()
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (isSubmitting) {
            return
        }

        const normalizedName = name.trim()

        if (!normalizedName) {
            nameInputRef.current?.setCustomValidity(
                'Informe o nome da coluna.'
            )
            nameInputRef.current?.reportValidity()
            nameInputRef.current?.setCustomValidity('')
            return
        }

        const options = optionsText
            .split('\n')
            .map((option) => option.trim())
            .filter(Boolean)

        if (dataType === 'SELECT' && options.length === 0) {
            setSubmitError('Informe pelo menos uma opção para a coluna de seleção.')
            return
        }

        const normalizedFormula = formulaExpression.trim()

        if (dataType === 'FORMULA' && !normalizedFormula) {
            setSubmitError('Informe a expressão da fórmula.')
            return
        }

        setIsSubmitting(true)
        setSubmitError(null)

        try {
            await onSubmit({
                column_id: column ? column.id : undefined,
                name: normalizedName,
                data_type: dataType,
                options: dataType === 'SELECT' ? options : undefined,
                formula_expression: dataType === 'FORMULA'
                    ? normalizedFormula
                    : undefined
            })

            onClose()
        } catch (err) {
            setSubmitError(getErrorMessage(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <dialog
            ref={dialogRef}
            className="column-form-modal"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            onCancel={(event) => {
                event.preventDefault()
                handleClose()
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    handleClose()
                }
            }}
        >
            <div className="column-form-modal-content">
                <header className="column-form-modal-header">
                    <div className="column-form-modal-heading">
                        <div className="column-form-modal-icon">
                            <Columns3 size={20} strokeWidth={1.9} />
                        </div>

                        <div>
                            <h2 id={titleId}>
                                {isEditing ? 'Configurar coluna' : 'Nova coluna'}
                            </h2>

                            <p aria-describedby={descriptionId}>
                                {isEditing
                                    ? 'Altere as propriedades desta coluna.'
                                    : 'Defina o nome e o tipo de dado da nova coluna.'}
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        aria-label="Fechar modal"
                    >
                        <X size={18} />
                    </Button>
                </header>

                <form
                    className="column-form-modal-form"
                    onSubmit={handleSubmit}
                >
                    <div className="column-form-modal-body">
                        <div className="column-form-modal-field">
                            <label htmlFor={nameId}>
                                Nome da coluna
                            </label>

                            <input
                                ref={nameInputRef}
                                id={nameId}
                                type="text"
                                value={name}
                                onChange={(event) => {
                                    setName(event.target.value)
                                    setSubmitError(null)
                                }}
                                placeholder="Ex.: Data"
                                maxLength={100}
                                required
                                disabled={isSubmitting}
                                autoFocus
                            />
                        </div>

                        <div className="column-form-modal-field">
                            <label htmlFor={dataTypeId}>
                                Tipo de dado
                            </label>

                            <select
                                id={dataTypeId}
                                value={dataType}
                                onChange={(event) => {
                                    setDataType(event.target.value)
                                    setSubmitError(null)
                                }}
                                disabled={isSubmitting}
                                required
                            >
                                {COLUMN_TYPES.map((type) => (
                                    <option
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </option>
                                ))}
                            </select>

                            <span className="column-form-modal-field-hint">
                                Alterar o tipo pode afetar a interpretação dos valores existentes.
                            </span>
                        </div>

                        {dataType === 'SELECT' && (
                            <div className="column-form-modal-field">
                                <label htmlFor={optionsId}>
                                    Opções
                                </label>

                                <textarea
                                    id={optionsId}
                                    value={optionsText}
                                    onChange={(event) => {
                                        setOptionsText(event.target.value)
                                        setSubmitError(null)
                                    }}
                                    placeholder={'Parado\nEm progresso\nFeito'}
                                    rows={4}
                                    disabled={isSubmitting}
                                    required
                                />

                                <span className="column-form-modal-field-hint">
                                    Informe uma opção por linha.
                                </span>
                            </div>
                        )}

                        {dataType === 'FORMULA' && (
                            <div className="column-form-modal-field">
                                <label htmlFor={formulaId}>
                                    Expressão da fórmula
                                </label>

                                <textarea
                                    id={formulaId}
                                    value={formulaExpression}
                                    onChange={(event) => {
                                        setFormulaExpression(event.target.value)
                                        setSubmitError(null)
                                    }}
                                    placeholder="Informe a expressão da fórmula"
                                    rows={4}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <footer className="column-form-modal-footer">
                        {submitError && (
                            <div className="column-form-modal-feedback">
                                <FormFeedback type="error">
                                    {submitError}
                                </FormFeedback>
                            </div>
                        )}

                        <div className="column-form-modal-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Salvando...'
                                    : isEditing
                                        ? 'Salvar alterações'
                                        : 'Criar coluna'}
                            </Button>
                        </div>
                    </footer>
                </form>
            </div>
        </dialog>
    )
}