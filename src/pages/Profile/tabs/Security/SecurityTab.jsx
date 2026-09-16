import { useState } from 'react'
import { Button } from '../../../../components/Button/Button'
import { ProfileSection } from '../../../../components/ProfileSection/ProfileSection'
import { Input } from '../../../../components/Input/Input'
import { useUser } from '../../../../hooks/useUser'
import { FormFeedback } from '../../../../components/FormFeedback/FormFeedback'
import { getErrorMessage } from '../../../../utils/error'
import { validateChangePasswordForm } from '../../../../utils/validation/userValidation'
import './SecurityTab.css'

export const SecurityTab = () => {
    const { updateUserPassword, updatingUserPassword, updateUserPasswordError, updateUserPasswordSuccess, resetUpdateUserPassword } = useUser()
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const hasChanges = formData.currentPassword.trim() !== '' && formData.newPassword.trim() !== '' && formData.confirmPassword.trim() !== ''

    const { currentPassword, newPassword } = formData

    const handleSubmit = async (event) => {
        event.preventDefault()

        resetUpdateUserPassword()

        if (!handleChange) {
            return
        }

        const newErrors = validateChangePasswordForm(formData)

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        await updateUserPassword({ currentPassword, newPassword })

        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        })
    }

    return (
        <div className="profile-tab-stack">
            <ProfileSection
                title="Segurança"
                description="Mantenha sua conta protegida."
            >
                <form onSubmit={handleSubmit}>
                    <div className="profile-password-intro">
                        <strong>
                            Alterar senha
                        </strong>

                        <p>
                            Informe sua senha atual e escolha
                            uma nova senha para sua conta.
                        </p>
                    </div>

                    <div className="profile-password-fields">
                        <Input
                            label="Senha atual"
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Digite sua senha atual"
                            autoComplete="current-password"
                            error={errors.currentPassword}
                        />

                        <Input
                            label="Nova senha"
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Digite a nova senha"
                            autoComplete="new-password"
                            error={errors.newPassword}
                        />

                        <div className="profile-password-confirm-field">
                            <Input
                                label="Confirmar nova senha"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirme sua nova senha"
                                autoComplete="new-password"
                                error={errors.confirmPassword}
                            />
                        </div>
                    </div>

                    {updateUserPasswordError && (
                        <FormFeedback type="error">
                            {getErrorMessage(
                                updateUserPasswordError,
                                'Não foi possível atualizar sua senha.'
                            )}
                        </FormFeedback >
                    )}

                    {updateUserPasswordSuccess && (
                        <FormFeedback type="success">
                            Sua senha foi atualizada com sucesso.
                        </FormFeedback >
                    )}

                    <div className="profile-form-actions">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!hasChanges || updatingUserPassword}
                        >
                            {updatingUserPassword
                                ? 'Atualizando...'
                                : 'Atualizar senha'}
                        </Button>
                    </div>
                </form>
            </ProfileSection>
        </div >
    )
}