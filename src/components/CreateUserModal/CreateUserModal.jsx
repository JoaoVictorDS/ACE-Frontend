import { useEffect, useRef, useState } from 'react'
import { Save, UserPlus, X } from 'lucide-react'
import { useCreateUser } from '../../hooks/useUser'
import { Input } from '../Input/Input'
import { FormFeedback } from '../FormFeedback/FormFeedback'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../utils/error'
import './CreateUserModal.css'

export const CreateUserModal = ({ onClose }) => {
    const dialogRef = useRef(null)
    const pointerDownTargetRef = useRef(null)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'MEMBER',
        preferences: JSON.stringify({}, null, 2)
    })
    const [preferencesError, setPreferencesError] = useState('')

    const { createUser, creatingUser, createUserError, resetCreateUser } = useCreateUser()
    const { success } = useToast()

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

        setFormData((current) => ({ ...current, [name]: value }))

        if (name === 'preferences') {
            setPreferencesError('')
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        resetCreateUser()

        if (creatingUser) {
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
            password: formData.password,
            role: formData.role,
            preferences
        }

        await createUser(payload)

        success({
            title: 'Usuário criado',
            message: `A conta de ${payload.name} foi criada com sucesso.`
        })

        onClose()
    }

    const handleClose = () => {
        if (!creatingUser) {
            onClose()
        }
    }

    return (
        <dialog
            ref={dialogRef}
            className="create-user-modal"
            aria-labelledby="create-user-modal-title"
            onCancel={(event) => {
                event.preventDefault()
                handleClose()
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

                if (isBackdropClick) {
                    handleClose()
                }
            }}
        >
            <div className="create-user-modal-content">
                <header className="create-user-modal-header">
                    <div className="create-user-modal-heading">
                        <span className="create-user-modal-icon">
                            <UserPlus size={22} strokeWidth={1.9} />
                        </span>

                        <div>
                            <h2 id="create-user-modal-title">
                                Novo usuário
                            </h2>

                            <p>
                                Cadastre uma nova conta no sistema.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="create-user-modal-close"
                        onClick={handleClose}
                        aria-label="Fechar criação de usuário"
                        disabled={creatingUser}
                    >
                        <X size={19} />
                    </button>
                </header>

                <form
                    className="create-user-modal-form"
                    onSubmit={handleSubmit}
                >
                    <div className="create-user-modal-body">
                        <section className="create-user-modal-section">
                            <div className="create-user-modal-section-heading">
                                <h3>Dados pessoais</h3>

                                <p>
                                    Informe os dados básicos da conta.
                                </p>
                            </div>

                            <div className="create-user-modal-grid">
                                <div className="create-user-modal-field">
                                    <Input
                                        id="create-user-name"
                                        type="text"
                                        name="name"
                                        label="Nome"
                                        value={formData.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                        disabled={creatingUser}
                                        required
                                    />
                                </div>

                                <div className="create-user-modal-field">
                                    <Input
                                        id="create-user-email"
                                        type="email"
                                        name="email"
                                        label="E-mail"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        disabled={creatingUser}
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="create-user-modal-section">
                            <div className="create-user-modal-section-heading">
                                <h3>Acesso ao sistema</h3>

                                <p>
                                    Defina o perfil inicial do usuário.
                                </p>
                            </div>

                            <div className="create-user-modal-field">
                                <label htmlFor="create-user-role">
                                    Perfil de acesso
                                </label>

                                <select
                                    id="create-user-role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    disabled={creatingUser}
                                >
                                    <option value="MEMBER">Membro</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                            </div>
                        </section>

                        <section className="create-user-modal-section">
                            <div className="create-user-modal-section-heading">
                                <h3>Segurança</h3>

                                <p>
                                    Defina a senha inicial da conta.
                                </p>
                            </div>

                            <div className="create-user-modal-field">
                                <Input
                                    id="create-user-password"
                                    type="password"
                                    name="password"
                                    label="Senha inicial"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    disabled={creatingUser}
                                    required
                                />
                            </div>
                        </section>

                        <section className="create-user-modal-section">
                            <div className="create-user-modal-section-heading">
                                <h3>Preferências</h3>

                                <p>
                                    Configure as preferências iniciais da conta.
                                </p>
                            </div>

                            <div className="create-user-modal-field">
                                <label htmlFor="create-user-preferences">
                                    Objeto de preferências
                                </label>

                                <textarea
                                    id="create-user-preferences"
                                    name="preferences"
                                    className="create-user-modal-json"
                                    value={formData.preferences}
                                    onChange={handleChange}
                                    spellCheck={false}
                                    rows={5}
                                    aria-invalid={Boolean(preferencesError)}
                                    aria-describedby="create-user-preferences-help create-user-preferences-error"
                                    disabled={creatingUser}
                                />

                                <span
                                    id="create-user-preferences-help"
                                    className="create-user-modal-help"
                                >
                                    As preferências devem estar em formato JSON válido.
                                </span>

                                {preferencesError && (
                                    <span
                                        id="create-user-preferences-error"
                                        className="create-user-modal-error"
                                        role="alert"
                                    >
                                        {preferencesError}
                                    </span>
                                )}
                            </div>
                        </section>
                    </div>

                    <footer className="create-user-modal-footer">
                        {createUserError && (
                            <div className="create-user-modal-footer-feedback">
                                <FormFeedback type="error">
                                    {getErrorMessage(createUserError)}
                                </FormFeedback>
                            </div>
                        )}

                        <div className="create-user-modal-footer-actions">
                            <button
                                type="button"
                                className="create-user-modal-cancel"
                                onClick={handleClose}
                                disabled={creatingUser}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="create-user-modal-save"
                                disabled={creatingUser}
                            >
                                <Save size={16} strokeWidth={2} />
                                {creatingUser ? 'Criando...' : 'Criar usuário'}
                            </button>
                        </div>
                    </footer>
                </form>
            </div>
        </dialog>
    )
}