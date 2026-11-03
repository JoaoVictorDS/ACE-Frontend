
import { useEffect, useId, useRef, useState } from 'react'
import { Eye, Pencil, Plus, ShieldCheck, Trash2, UserRound, Users, X, ListOrdered, ArrowDown, ArrowUp, } from 'lucide-react'
import { Button } from '../Button/Button'
import { FormFeedback } from '../FormFeedback/FormFeedback'
import { getErrorMessage } from '../../utils/error'
import './ColumnRestrictionsModal.css'

const RESTRICTABLE_ROLES = [
    { value: 'EDITOR', label: 'Editor' },
    { value: 'VIEWER', label: 'Visualizador' }
]

const getRestrictionTarget = (restriction, boardMembers) => {
    if (restriction.user_id != null) {
        const member = boardMembers.find((item) => Number(item.user_id) === Number(restriction.user_id))

        return {
            type: 'member',
            title: member?.user?.name ?? `Usuário #${restriction.user_id}`,
            subtitle: 'Membro específico',
            role: member?.role
        }
    }

    const role = RESTRICTABLE_ROLES.find((item) => item.value === restriction.board_role)

    return {
        type: 'role',
        title: role?.label ?? restriction.board_role,
        subtitle: 'Papel do board',
        role: restriction.board_role
    }
}

export const ColumnRestrictionsModal = ({ column, boardMembers = [], onSubmit, onClose }) => {
    const dialogRef = useRef(null)

    const titleId = useId()
    const descriptionId = useId()
    const memberSelectId = useId()
    const roleSelectId = useId()

    const [restrictions, setRestrictions] = useState(() => column.restrictions ?? [])

    const [formOpen, setFormOpen] = useState(false)
    const [editingRestriction, setEditingRestriction] = useState(null)

    const [targetType, setTargetType] = useState('member')
    const [selectedUserId, setSelectedUserId] = useState('')
    const [selectedRole, setSelectedRole] = useState('EDITOR')

    const [canView, setCanView] = useState(true)
    const [canEdit, setCanEdit] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [confirmingRemovalId, setConfirmingRemovalId] = useState(null)
    const [submitError, setSubmitError] = useState(null)

    const isEditing = Boolean(editingRestriction)

    const availableMembers = boardMembers.filter((member) => {
        const isEligible = ['EDITOR', 'VIEWER'].includes(member.role) && member.user?.role !== 'ADMIN'

        if (editingRestriction?.user_id != null && Number(editingRestriction.user_id) === Number(member.user_id)) {
            return true
        }

        if (!isEligible) return false

        return !restrictions.some((restriction) => restriction.user_id != null && Number(restriction.user_id) === Number(member.user_id))
    })

    const availableRoles = RESTRICTABLE_ROLES.filter(({ value }) => {
        if (editingRestriction?.board_role === value) {
            return true
        }

        return !restrictions.some((restriction) => restriction.board_role === value)
    })

    const selectedMember = boardMembers.find((member) => Number(member.user_id) === Number(selectedUserId))
    const isViewerTarget = targetType === 'role' ? selectedRole === 'VIEWER' : selectedMember?.role === 'VIEWER'

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

    useEffect(() => {
        if (isViewerTarget) {
            setCanEdit(false)
        }
    }, [isViewerTarget])

    const resetForm = () => {
        setFormOpen(false)
        setEditingRestriction(null)
        setTargetType('member')
        setSelectedUserId('')
        setSelectedRole('EDITOR')
        setCanView(true)
        setCanEdit(false)
        setSubmitError(null)
    }

    const handleClose = () => {
        if (!isSubmitting) {
            onClose()
        }
    }

    const handleOpenAddForm = () => {
        setEditingRestriction(null)
        setTargetType('member')
        setSelectedUserId('')
        setSelectedRole(availableRoles[0]?.value ?? '')
        setCanView(true)
        setCanEdit(false)
        setSubmitError(null)
        setConfirmingRemovalId(null)
        setFormOpen(true)
    }

    const handleEditRestriction = (restriction) => {
        setEditingRestriction(restriction)

        if (restriction.user_id != null) {
            setTargetType('member')
            setSelectedUserId(String(restriction.user_id))
        } else {
            setTargetType('role')
            setSelectedRole(restriction.board_role)
        }

        const restrictionCanView = Boolean(restriction.can_view)

        setCanView(restrictionCanView)
        setCanEdit(
            restrictionCanView && Boolean(restriction.can_edit)
        )

        setSubmitError(null)
        setConfirmingRemovalId(null)
        setFormOpen(true)
    }

    const handleTargetTypeChange = (nextType) => {
        setTargetType(nextType)
        setSelectedUserId('')

        if (nextType === 'role') {
            setSelectedRole(availableRoles[0]?.value ?? '')
        } else {
            setSelectedRole('EDITOR')
        }

        setSubmitError(null)
    }

    const handleViewChange = (checked) => {
        setCanView(checked)

        if (!checked) {
            setCanEdit(false)
        }

        setSubmitError(null)
    }

    const handleEditChange = (checked) => {
        if (isViewerTarget) return

        setCanEdit(checked)

        if (checked) {
            setCanView(true)
        }

        setSubmitError(null)
    }

    const handleSubmitForm = (event) => {
        event.preventDefault()

        if (targetType === 'member' && !selectedUserId) {
            setSubmitError('Selecione um membro do board.')
            return
        }

        if (targetType === 'role' && !selectedRole) {
            setSubmitError('Selecione um papel.')
            return
        }

        const restrictionData = {
            ...(targetType === 'member'
                ? { user_id: Number(selectedUserId) }
                : { board_role: selectedRole }),
            can_view: canView,
            can_edit: isViewerTarget ? false : canEdit
        }

        const duplicatedRestriction = restrictions.some((restriction) => {
            if (restriction.id === editingRestriction?.id) {
                return false
            }

            if (targetType === 'member') {
                return (restriction.user_id != null && Number(restriction.user_id) === Number(selectedUserId))
            }

            return restriction.board_role === selectedRole
        })

        if (duplicatedRestriction) {
            setSubmitError('Já existe uma restrição para esse membro ou papel.')
            return
        }

        if (editingRestriction) {
            setRestrictions((current) => current.map((restriction) => restriction.id === editingRestriction.id
                ? { ...restriction, ...restrictionData }
                : restriction
            ))
        } else {
            setRestrictions((current) => [
                ...current,
                {
                    id: `draft-${Date.now()}`,
                    ...restrictionData
                }
            ])
        }

        resetForm()
    }

    const handleRemoveRestriction = (restriction) => {
        setRestrictions((current) =>
            current.filter((item) => item.id !== restriction.id)
        )

        if (editingRestriction?.id === restriction.id) {
            resetForm()
        }

        setConfirmingRemovalId(null)
        setSubmitError(null)
    }

    const handleSave = async () => {
        if (isSubmitting || formOpen) return

        const normalizedRestrictions = restrictions.map((restriction) => ({
            ...(restriction.user_id != null
                ? { user_id: Number(restriction.user_id) }
                : { board_role: restriction.board_role }),
            can_view: Boolean(restriction.can_view),
            can_edit: Boolean(restriction.can_edit)
        }))

        setIsSubmitting(true)
        setSubmitError(null)

        try {
            await onSubmit({
                columnId: column.id,
                restrictions: normalizedRestrictions
            })

            onClose()
        } catch (err) {
            setSubmitError(getErrorMessage(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleMoveRestriction = (index, direction) => {
        setRestrictions((current) => {
            const nextIndex = index + direction

            if (nextIndex < 0 || nextIndex >= current.length) {
                return current
            }

            const next = [...current]

            const [restriction] = next.splice(index, 1)

            next.splice(nextIndex, 0, restriction)

            return next
        })

        setConfirmingRemovalId(null)
        setSubmitError(null)
    }

    return (
        <dialog
            ref={dialogRef}
            className="column-restrictions-modal"
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
            <div className="column-restrictions-modal-content">
                <header className="column-restrictions-modal-header">
                    <div className="column-restrictions-modal-heading">
                        <div className="column-restrictions-modal-icon">
                            <ShieldCheck size={20} strokeWidth={1.9} />
                        </div>

                        <div>
                            <h2 id={titleId}>
                                Restrições de acesso
                            </h2>

                            <p id={descriptionId}>
                                Gerencie as permissões da coluna
                                <strong> {column.name}</strong>.
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

                <div className="column-restrictions-modal-body">
                    <div className="column-restrictions-modal-section-heading">
                        <div>
                            <h3>Regras de acesso</h3>

                            <p>
                                Restrições aplicadas a membros ou papéis do board.
                            </p>
                        </div>

                        {!formOpen && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleOpenAddForm}
                                disabled={isSubmitting}
                            >
                                <Plus size={15} />
                                Adicionar
                            </Button>
                        )}
                    </div>
                    <div className="column-restrictions-modal-order-notice">
                        <ListOrdered size={17} />

                        <div>
                            <strong>A ordem das regras importa!</strong>

                            <span>
                                A primeira regra correspondente ao usuário será aplicada.
                                Coloque exceções individuais acima das regras gerais por papel.
                            </span>
                        </div>
                    </div>

                    {restrictions.length === 0 ? (
                        <div className="column-restrictions-modal-empty">
                            <ShieldCheck size={25} strokeWidth={1.6} />

                            <strong>Nenhuma restrição configurada</strong>

                            <span>
                                Todos os membros seguem as permissões padrão
                                desta coluna.
                            </span>
                        </div>
                    ) : (
                        <div className="column-restrictions-modal-list">
                            {restrictions.map((restriction, index) => {
                                const target = getRestrictionTarget(
                                    restriction,
                                    boardMembers
                                )

                                const isConfirming = confirmingRemovalId === restriction.id

                                return (
                                    <div
                                        key={restriction.id}
                                        className="column-restrictions-modal-item"
                                    >
                                        <div className="column-restrictions-modal-item-order">
                                            <span>{index + 1}</span>

                                            <div className="column-restrictions-modal-order-actions">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="column-restrictions-modal-icon-button"
                                                    title="Mover para cima"
                                                    aria-label={`Mover regra ${index + 1} para cima`}
                                                    disabled={index === 0 || isSubmitting || formOpen}
                                                    onClick={() => handleMoveRestriction(index, -1)}
                                                >
                                                    <ArrowUp size={15} />
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="column-restrictions-modal-icon-button"
                                                    title="Mover para baixo"
                                                    aria-label={`Mover regra ${index + 1} para baixo`}
                                                    disabled={
                                                        index === restrictions.length - 1 ||
                                                        isSubmitting ||
                                                        formOpen
                                                    }
                                                    onClick={() => handleMoveRestriction(index, 1)}
                                                >
                                                    <ArrowDown size={15} />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="column-restrictions-modal-item-icon">
                                            {target.type === 'member'
                                                ? <UserRound size={17} />
                                                : <Users size={17} />
                                            }
                                        </div>

                                        <div className="column-restrictions-modal-item-info">
                                            <strong title={target.title}>
                                                {target.title}
                                            </strong>

                                            <span>
                                                {target.subtitle}
                                                {target.role && ` · ${target.role}`}
                                            </span>

                                            <div className="column-restrictions-modal-permissions">
                                                <span className={
                                                    restriction.can_view
                                                        ? 'is-allowed'
                                                        : 'is-denied'
                                                }>
                                                    <Eye size={12} />
                                                    {restriction.can_view
                                                        ? 'Visualiza'
                                                        : 'Não visualiza'}
                                                </span>

                                                <span className={
                                                    restriction.can_edit
                                                        ? 'is-allowed'
                                                        : 'is-denied'
                                                }>
                                                    <Pencil size={12} />
                                                    {restriction.can_edit
                                                        ? 'Edita'
                                                        : 'Não edita'}
                                                </span>
                                            </div>
                                        </div>

                                        {isConfirming ? (
                                            <div className="column-restrictions-modal-remove-confirm">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => setConfirmingRemovalId(null)}
                                                    disabled={isSubmitting}
                                                >
                                                    Cancelar
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleRemoveRestriction(restriction)}
                                                    disabled={isSubmitting}
                                                >
                                                    Remover
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="column-restrictions-modal-item-actions">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="column-restrictions-modal-icon-button"
                                                    title="Editar restrição"
                                                    aria-label={`Editar restrição de ${target.title}`}
                                                    onClick={() => handleEditRestriction(restriction)}
                                                    disabled={isSubmitting || formOpen}
                                                >
                                                    <Pencil size={15} />
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="column-restrictions-modal-icon-button"
                                                    title="Remover restrição"
                                                    aria-label={`Remover restrição de ${target.title}`}
                                                    onClick={() => setConfirmingRemovalId(restriction.id)}
                                                    disabled={isSubmitting || formOpen}
                                                >
                                                    <Trash2 size={15} />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {formOpen && (
                        <form
                            className="column-restrictions-modal-form"
                            onSubmit={handleSubmitForm}
                        >
                            <div className="column-restrictions-modal-form-header">
                                <div>
                                    <h3>
                                        {isEditing
                                            ? 'Editar restrição'
                                            : 'Nova restrição'
                                        }
                                    </h3>

                                    <p>
                                        Defina o alvo e as permissões que serão aplicadas.
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="column-restrictions-modal-form-close"
                                    onClick={resetForm}
                                    disabled={isSubmitting}
                                    aria-label="Cancelar edição"
                                >
                                    <X size={16} />
                                </Button>
                            </div>

                            <div className="column-restrictions-modal-target-type">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className={targetType === 'member' ? 'is-active' : ''}
                                    onClick={() => handleTargetTypeChange('member')}
                                    disabled={isEditing || isSubmitting}
                                    aria-pressed={targetType === 'member'}
                                >
                                    <UserRound size={15} />
                                    Membro
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className={targetType === 'role' ? 'is-active' : ''}
                                    onClick={() => handleTargetTypeChange('role')}
                                    disabled={isEditing || isSubmitting}
                                    aria-pressed={targetType === 'role'}
                                >
                                    <Users size={15} />
                                    Papel
                                </Button>
                            </div>

                            {targetType === 'member' ? (
                                <div className="column-restrictions-modal-field">
                                    <label htmlFor={memberSelectId}>
                                        Membro do board
                                    </label>

                                    <select
                                        id={memberSelectId}
                                        value={selectedUserId}
                                        onChange={(event) => {
                                            setSelectedUserId(event.target.value)
                                            setSubmitError(null)
                                        }}
                                        disabled={isEditing || isSubmitting}
                                        required
                                    >
                                        <option value="">
                                            Selecione um membro
                                        </option>

                                        {availableMembers.map((member) => (
                                            <option
                                                key={member.user_id}
                                                value={member.user_id}
                                            >
                                                {member.user?.name ?? `Usuário #${member.user_id}`}
                                                {' · '}
                                                {member.role}
                                            </option>
                                        ))}
                                    </select>

                                    {availableMembers.length === 0 && !isEditing && (
                                        <span className="column-restrictions-modal-field-hint">
                                            Não há membros disponíveis para adicionar.
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="column-restrictions-modal-field">
                                    <label htmlFor={roleSelectId}>
                                        Papel do board
                                    </label>

                                    <select
                                        id={roleSelectId}
                                        value={selectedRole}
                                        onChange={(event) => {
                                            setSelectedRole(event.target.value)
                                            setSubmitError(null)
                                        }}
                                        disabled={isEditing || isSubmitting}
                                        required
                                    >
                                        <option value="" disabled>
                                            Selecione um papel
                                        </option>

                                        {availableRoles.map((role) => (
                                            <option
                                                key={role.value}
                                                value={role.value}
                                            >
                                                {role.label}
                                            </option>
                                        ))}
                                    </select>

                                    {availableRoles.length === 0 && !isEditing && (
                                        <span className="column-restrictions-modal-field-hint">
                                            Todos os papéis disponíveis já possuem restrições.
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="column-restrictions-modal-permission-fields">
                                <span className="column-restrictions-modal-field-label">
                                    Permissões
                                </span>

                                <label className="column-restrictions-modal-permission-option">
                                    <input
                                        type="checkbox"
                                        checked={canView}
                                        onChange={(event) => handleViewChange(event.target.checked)}
                                        disabled={isSubmitting}
                                    />

                                    <span>
                                        <Eye size={16} />

                                        <span>
                                            <strong>Visualizar</strong>

                                            <small>
                                                Permite acessar e visualizar os valores da coluna.
                                            </small>
                                        </span>
                                    </span>
                                </label>

                                <label className="column-restrictions-modal-permission-option">
                                    <input
                                        type="checkbox"
                                        checked={canEdit}
                                        onChange={(event) => handleEditChange(event.target.checked)}
                                        disabled={isSubmitting || !canView || isViewerTarget}
                                    />
                                    <span>
                                        <Pencil size={16} />

                                        <span>
                                            <strong>Editar</strong>

                                            <small>
                                                Permite alterar os valores da coluna.
                                            </small>
                                        </span>
                                    </span>
                                </label>

                                {isViewerTarget && (
                                    <span className="column-restrictions-modal-viewer-hint">
                                        Usuários com papel Viewer não podem editar valores das colunas.
                                    </span>
                                )}

                            </div>

                            {submitError && (
                                <FormFeedback type="error">
                                    {submitError}
                                </FormFeedback>
                            )}

                            <div className="column-restrictions-modal-form-actions">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={resetForm}
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={
                                        isSubmitting ||
                                        (targetType === 'member' && !selectedUserId) ||
                                        (targetType === 'role' && !selectedRole) ||
                                        (targetType === 'member' && !isEditing && availableMembers.length === 0) ||
                                        (targetType === 'role' && !isEditing && availableRoles.length === 0)
                                    }
                                >
                                    {isEditing
                                        ? 'Aplicar alteração'
                                        : 'Adicionar à lista'
                                    }
                                </Button>
                            </div>
                        </form>
                    )}
                </div>

                <footer className="column-restrictions-modal-footer">
                    {submitError && !formOpen && (
                        <FormFeedback type="error">
                            {submitError}
                        </FormFeedback>
                    )}

                    <div className="column-restrictions-modal-footer-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Descartar
                        </Button>

                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleSave}
                            disabled={isSubmitting || formOpen}
                        >
                            {isSubmitting
                                ? 'Salvando...'
                                : 'Salvar restrições'
                            }
                        </Button>
                    </div>
                </footer>
            </div>
        </dialog>
    )
}
