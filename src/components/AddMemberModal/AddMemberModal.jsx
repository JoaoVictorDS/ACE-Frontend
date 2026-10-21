import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Search, UserPlus, X } from 'lucide-react'
import { Button } from '../Button/Button'
import { UserAvatar } from '../UserAvatar/UserAvatar'
import { FormFeedback } from '../FormFeedback/FormFeedback'
import { getErrorMessage } from '../../utils/error'
import { normalizeText } from '../../utils/text'
import { ADD_MEMBER_ROLE_OPTIONS, getMembershipRoleLabel } from '../../utils/role'
import './AddMemberModal.css'

export const AddMemberModal = ({
    title = 'Adicionar membro',
    description = 'Selecione um usuário e defina sua permissão.',
    users = [],
    roleOptions = ADD_MEMBER_ROLE_OPTIONS,
    defaultRole = 'VIEWER',
    isLoadingUsers = false,
    usersError = null,
    onRetryUsers,
    onClose,
    onSubmit
}) => {
    const dialogRef = useRef(null)

    const [search, setSearch] = useState('')
    const [selectedUserId, setSelectedUserId] = useState('')
    const [selectedRole, setSelectedRole] = useState(roleOptions.includes(defaultRole) ? defaultRole : roleOptions[0] || 'VIEWER')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)

    const filteredUsers = useMemo(() => {
        const normalizedSearch = normalizeText(search.trim())

        if (!normalizedSearch) {
            return users
        }

        return users.filter((user) => {
            const searchableText = normalizeText(
                `${user.name ?? ''} ${user.email ?? ''}`
            )

            return searchableText.includes(normalizedSearch)
        })
    }, [users, search])

    const selectedUser = users.find((user) => String(user.id) === String(selectedUserId))

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

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!selectedUser || !selectedRole || isSubmitting) {
            return
        }

        setIsSubmitting(true)
        setSubmitError(null)

        try {
            await onSubmit({
                user: selectedUser,
                role: selectedRole
            })

            onClose()
        } catch (err) {
            setSubmitError(getErrorMessage(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        if (!isSubmitting) {
            onClose()
        }
    }

    return (
        <dialog
            ref={dialogRef}
            className="add-member-modal"
            aria-labelledby="add-member-modal-title"
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
            <div className="add-member-modal-content">
                <header className="add-member-modal-header">
                    <div className="add-member-modal-heading">
                        <div className="add-member-modal-icon">
                            <UserPlus size={20} strokeWidth={1.9} />
                        </div>

                        <div>
                            <h2 id="add-member-modal-title">
                                {title}
                            </h2>

                            <p>
                                {description}
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
                    className="add-member-modal-form"
                    onSubmit={handleSubmit}
                >
                    <div className="add-member-modal-body">
                        <label
                            className="add-member-modal-label"
                            htmlFor="add-member-search"
                        >
                            Buscar usuário
                        </label>

                        <div className="add-member-modal-search">
                            <Search size={17} strokeWidth={2} />

                            <input
                                id="add-member-search"
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Nome ou e-mail..."
                                aria-label="Buscar usuários por nome ou e-mail"
                            />
                        </div>

                        <div
                            className="add-member-modal-users"
                            role="radiogroup"
                            aria-label="Selecionar usuário"
                        >
                            {isLoadingUsers && (
                                <div
                                    className="add-member-modal-state"
                                    role="status"
                                >
                                    <span className="add-member-modal-loading" />
                                    Carregando usuários disponíveis...
                                </div>
                            )}

                            {!isLoadingUsers && usersError && (
                                <div className="add-member-modal-load-error">
                                    <FormFeedback type="error">
                                        {getErrorMessage(usersError)}
                                    </FormFeedback>

                                    {onRetryUsers && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={onRetryUsers}
                                        >
                                            Tentar novamente
                                        </Button>
                                    )}
                                </div>
                            )}

                            {!isLoadingUsers && !usersError && filteredUsers.length === 0 && (
                                <div className="add-member-modal-state">
                                    {users.length === 0
                                        ? 'Não há usuários ativos disponíveis para adicionar.'
                                        : 'Nenhum usuário encontrado para essa busca.'}
                                </div>
                            )}

                            {!isLoadingUsers && !usersError && filteredUsers.map((user) => {
                                const isSelected = String(selectedUserId) === String(user.id)

                                return (
                                    <label
                                        key={user.id}
                                        className={`add-member-modal-user ${isSelected ? 'add-member-modal-user-selected' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="add-member-user"
                                            value={user.id}
                                            checked={isSelected}
                                            onChange={() => setSelectedUserId(String(user.id))}
                                            disabled={isSubmitting}
                                        />

                                        <UserAvatar user={user} />

                                        <span className="add-member-modal-user-info">
                                            <strong>
                                                {user.name || 'Usuário sem nome'}
                                            </strong>

                                            <span>
                                                {user.email || 'Sem e-mail'}
                                            </span>
                                        </span>

                                        <span className="add-member-modal-radio" />
                                    </label>
                                )
                            })}
                        </div>

                        <div className="add-member-modal-role-field">
                            <label
                                className="add-member-modal-label"
                                htmlFor="add-member-role"
                            >
                                Permissão inicial
                            </label>

                            <select
                                id="add-member-role"
                                value={selectedRole}
                                onChange={(event) => setSelectedRole(event.target.value)}
                                disabled={isSubmitting || roleOptions.length === 0}
                            >
                                {roleOptions.map((role) => (
                                    <option key={role} value={role}>
                                        {getMembershipRoleLabel(role)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <footer className="add-member-modal-footer">
                        {submitError && (
                            <div className="add-member-modal-feedback">
                                <FormFeedback type="error">
                                    {submitError}
                                </FormFeedback>
                            </div>
                        )}

                        <div className="add-member-modal-actions">
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
                                disabled={
                                    !selectedUser ||
                                    !selectedRole ||
                                    isSubmitting ||
                                    isLoadingUsers ||
                                    Boolean(usersError)
                                }
                            >
                                <Plus size={16} strokeWidth={2} />
                                {isSubmitting ? 'Adicionando...' : 'Adicionar membro'}
                            </Button>
                        </div>
                    </footer>
                </form>
            </div>
        </dialog>
    )
}