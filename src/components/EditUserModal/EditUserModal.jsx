import { useEffect, useRef, useState } from 'react'
import { Save, ShieldCheck, X } from 'lucide-react'
import { useUpdateUserProfileById, useDeleteUser, useReactivateUser } from '../../hooks/useUser'
import { UserAvatar } from '../UserAvatar/UserAvatar'
import { Input } from '../Input/Input'
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog'
import { useToast } from '../../hooks/useToast'
import { FormFeedback } from '../FormFeedback/FormFeedback'
import { getErrorMessage } from '../../utils/error'
import './EditUserModal.css'

export const EditUserModal = ({ user, onClose }) => {
    const dialogRef = useRef(null)
    const pointerDownTargetRef = useRef(null)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        preferences: {}
    })
    const [preferencesError, setPreferencesError] = useState('')
    const [confirmation, setConfirmation] = useState(null)

    const { updateUserProfileById, updatingUserProfileById, updateUserProfileByIdError, resetUpdateUserProfileById } = useUpdateUserProfileById()
    const { deleteUser, deletingUser, deleteUserError, resetDeleteUser } = useDeleteUser()
    const { reactivateUser, reactivatingUser, reactivateUserError, resetReactivateUser } = useReactivateUser()
    const { success } = useToast()

    const isBusy = updatingUserProfileById || deletingUser || reactivatingUser
    const hasChanges =
        formData.name.trim() !== '' &&
        formData.email.trim() !== '' &&
        (
            formData.name.trim() !== (user?.name.trim() || '') ||
            formData.email.trim() !== (user?.email.trim() || '') ||
            formData.role !== (user?.role || '') ||
            formData.password.length >= 6 ||
            formData.preferences !== (JSON.stringify(user?.preferences || {}, null, 2) || {})
        )

    useEffect(() => {
        if (!user) return

        setFormData({
            name: user.name || '',
            email: user.email || '',
            password: '',
            role: user.role || '',
            preferences: JSON.stringify(user.preferences || {}, null, 2) || {}
        })
    }, [user])

    useEffect(() => {
        const dialog = dialogRef.current

        if (!dialog) {
            return
        }

        if (!dialog.open) {
            dialog.showModal()
        }

        return () => {
            if (dialog.open) {
                dialog.close()
            }
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        if (name === 'preferences') {
            setPreferencesError('')
        }
    }

    const handleToggleStatus = () => {
        resetUpdateUserProfileById()
        resetDeleteUser()
        resetReactivateUser()

        const isActive = user.is_active === true

        setConfirmation({
            action: isActive ? 'deactivate' : 'reactivate',
            title: isActive ? 'Desativar conta?' : 'Reativar conta?',
            message: isActive
                ? `Tem certeza de que deseja desativar a conta de ${user.name}? O usuário perderá acesso ao sistema e será removido de todos os workspaces e boards dos quais participa. Se a conta for reativada futuramente, esses vínculos não serão restaurados automaticamente.`
                : `Deseja reativar a conta de ${user.name}? O acesso ao sistema será reativado, mas os vínculos anteriores com workspaces e boards não serão restaurados automaticamente.`,
            confirmLabel: isActive ? 'Desativar conta' : 'Reativar conta',
            variant: isActive ? 'danger' : 'primary'
        })
    }

    const handleConfirmStatusChange = async () => {
        if (!confirmation || isBusy) {
            return
        }

        if (confirmation.action === 'deactivate') {
            await deleteUser(user.id)

            success({
                title: 'Conta desativada',
                message: `A conta de ${user.name || 'usuário'} foi desativada com sucesso.`
            })

            setConfirmation(null)
            onClose()
            return
        }

        await reactivateUser(user.id)

        success({
            title: 'Conta reativada',
            message: `A conta de ${user.name || 'usuário'} foi reativada com sucesso.`
        })

        setConfirmation(null)
        onClose()
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        resetUpdateUserProfileById()
        resetDeleteUser()
        resetReactivateUser()

        if (!hasChanges || isBusy) {
            return
        }

        let preferences

        try {
            preferences = JSON.parse(formData.preferences || '{}')
        } catch {
            setPreferencesError('Informe um JSON válido para as preferências.')
            return
        }

        if (!preferences || typeof preferences !== 'object' || Array.isArray(preferences)) {
            setPreferencesError('As preferências devem ser um objeto JSON.')
            return
        }

        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            role: formData.role,
            preferences
        }

        if (formData.password.length >= 6) {
            payload.password = formData.password
        }

        await updateUserProfileById({
            userId: user.id,
            data: payload
        })

        success({
            title: 'Dados do usuário atualizados',
            message: 'Os dados do usuário foram atualizados com sucesso.'
        })

        onClose()
    }

    return (
        <>
            <dialog
                ref={dialogRef}
                className="edit-user-modal"
                aria-labelledby="edit-user-modal-title"
                onCancel={(event) => {
                    event.preventDefault()

                    if (!isBusy) {
                        onClose()
                    }
                }}
                onPointerDown={(event) => {
                    pointerDownTargetRef.current = event.target
                }}
                onClick={(event) => {
                    const isBackdropClick = (
                        event.target === event.currentTarget &&
                        pointerDownTargetRef.current === event.currentTarget
                    )

                    pointerDownTargetRef.current = null

                    if (isBackdropClick && !isBusy) {
                        onClose()
                    }
                }}
            >
                <div className="edit-user-modal-content">
                    <header className="edit-user-modal-header">
                        <div className="edit-user-modal-heading">
                            <UserAvatar user={user} />

                            <div>
                                <h2 id="edit-user-modal-title">
                                    Editar usuário
                                </h2>

                                <p>
                                    Altere os dados da conta de {user.name || 'usuário'}.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="edit-user-modal-close"
                            onClick={onClose}
                            aria-label="Fechar edição de usuário"
                            disabled={isBusy}
                        >
                            <X size={19} />
                        </button>
                    </header>

                    <form
                        className="edit-user-modal-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="edit-user-modal-body">
                            <section className="edit-user-modal-section">
                                <div className="edit-user-modal-section-heading">
                                    <h3>Dados pessoais</h3>

                                    <p>
                                        Informações principais da conta.
                                    </p>
                                </div>

                                <div className="edit-user-modal-grid">
                                    <div className="edit-user-modal-field">
                                        <Input
                                            id="edit-user-name"
                                            type="text"
                                            name="name"
                                            label="Nome"
                                            value={formData.name}
                                            onChange={handleChange}
                                            autoComplete="name"
                                            disabled={isBusy}
                                            required
                                        />
                                    </div>

                                    <div className="edit-user-modal-field">
                                        <Input
                                            id="edit-user-email"
                                            type="email"
                                            name="email"
                                            label="E-mail"
                                            value={formData.email}
                                            onChange={handleChange}
                                            autoComplete="email"
                                            disabled={isBusy}
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="edit-user-modal-section">
                                <div className="edit-user-modal-section-heading">
                                    <h3>Acesso ao sistema</h3>

                                    <p>
                                        Defina o perfil de acesso do usuário.
                                    </p>
                                </div>

                                <div className="edit-user-modal-field">
                                    <label htmlFor="edit-user-role">
                                        Perfil de acesso
                                    </label>

                                    <select
                                        id="edit-user-role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        disabled={isBusy}
                                    >
                                        <option value="ADMIN">Administrador</option>
                                        <option value="MEMBER">Membro</option>
                                    </select>
                                </div>
                            </section>

                            <section className="edit-user-modal-section">
                                <div className="edit-user-modal-section-heading">
                                    <h3>Segurança</h3>

                                    <p>
                                        Informe uma nova senha somente se quiser redefini-la.
                                    </p>
                                </div>

                                <div className="edit-user-modal-field">
                                    <Input
                                        id="edit-user-password"
                                        type="password"
                                        name="password"
                                        label="Nova senha"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        placeholder="Deixe em branco para manter a senha atual"
                                        disabled={isBusy}
                                    />

                                    <span className="edit-user-modal-help">
                                        A senha atual não é exibida. Uma senha vazia não será enviada.
                                    </span>
                                </div>
                            </section>

                            <section className="edit-user-modal-section">
                                <div className="edit-user-modal-section-heading">
                                    <h3>Preferências</h3>

                                    <p>
                                        Edite as preferências da conta em formato JSON.
                                    </p>
                                </div>

                                <div className="edit-user-modal-field">
                                    <label htmlFor="edit-user-preferences">
                                        Objeto de preferências
                                    </label>

                                    <textarea
                                        id="edit-user-preferences"
                                        name="preferences"
                                        value={formData.preferences}
                                        onChange={handleChange}
                                        spellCheck={false}
                                        rows={6}
                                        aria-invalid={Boolean(preferencesError)}
                                        aria-describedby="edit-user-preferences-help edit-user-preferences-error"
                                        disabled={isBusy}
                                        className="edit-user-modal-json"
                                    />

                                    <span
                                        id="edit-user-preferences-help"
                                        className="edit-user-modal-help"
                                    >
                                        Mantenha a estrutura JSON válida para salvar as preferências.
                                    </span>

                                    {preferencesError && (
                                        <span
                                            id="edit-user-preferences-error"
                                            className="edit-user-modal-error"
                                            role="alert"
                                        >
                                            {preferencesError}
                                        </span>
                                    )}
                                </div>
                            </section>

                            <section className="edit-user-modal-status">
                                <div className="edit-user-modal-status-info">
                                    <span className="edit-user-modal-status-icon">
                                        <ShieldCheck size={19} />
                                    </span>

                                    <div>
                                        <h3>Status da conta</h3>

                                        <p>
                                            Esta conta está atualmente {user.is_active ? 'ativada' : 'desativada'}.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="edit-user-modal-status-button"
                                    onClick={handleToggleStatus}
                                    disabled={isBusy}
                                >
                                    {user.is_active ? 'Desativar conta' : 'Reativar conta'}
                                </button>
                            </section>
                        </div>

                        <footer className="edit-user-modal-footer">

                            {updateUserProfileByIdError && (
                                <div className="edit-user-modal-footer-feedback">
                                    <FormFeedback type="error">
                                        {getErrorMessage(updateUserProfileByIdError)}
                                    </FormFeedback>
                                </div>
                            )}

                            {deleteUserError && (
                                <div className="edit-user-modal-footer-feedback">
                                    <FormFeedback type="error">
                                        {getErrorMessage(deleteUserError)}
                                    </FormFeedback>
                                </div>
                            )}

                            {reactivateUserError && (
                                <div className="edit-user-modal-footer-feedback">
                                    <FormFeedback type="error">
                                        {getErrorMessage(reactivateUserError)}
                                    </FormFeedback>
                                </div>
                            )}

                            <div className="edit-user-modal-footer-actions">
                                <button
                                    type="button"
                                    className="edit-user-modal-cancel"
                                    onClick={onClose}
                                    disabled={isBusy}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="edit-user-modal-save"
                                    disabled={isBusy || !hasChanges}
                                >
                                    <Save size={16} strokeWidth={2} />
                                    {updatingUserProfileById ? 'Salvando...' : 'Salvar alterações'}
                                </button>
                            </div>
                        </footer>
                    </form>
                </div>
            </dialog>

            {confirmation && (
                <ConfirmDialog
                    title={confirmation.title}
                    message={confirmation.message}
                    confirmLabel={confirmation.confirmLabel}
                    variant={confirmation.variant}
                    isPending={deletingUser || reactivatingUser}
                    onCancel={() => setConfirmation(null)}
                    onConfirm={handleConfirmStatusChange}
                />
            )}
        </>
    )
}