import { useEffect, useState } from 'react'
import { Button } from '../../../../components/Button/Button'
import { ProfileSection } from '../../../../components/ProfileSection/ProfileSection'
import { Input } from '../../../../components/Input/Input'
import { Toggle } from '../../../../components/Toggle/Toggle'
import { ProfileUserSummary } from '../../../../components/ProfileUserSummary/ProfileUserSummary'
import { useUser } from '../../../../hooks/useUser'
import { FormFeedback } from '../../../../components/FormFeedback/FormFeedback'
import { getErrorMessage } from '../../../../utils/error'
import { validateProfileForm } from '../../../../utils/validation/userValidation'
import './ProfileTab.css'

export const ProfileTab = () => {
    const { data: user, updateUserProfile, updatingUserProfile, updateUserProfileError, updateUserProfileSuccess, resetUpdateUserProfile } = useUser()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        preferences: {}
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (!user) return

        setFormData({
            name: user.name || '',
            email: user.email || '',
            preferences: user.preferences || {}
        })
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const hasChanges =
        formData.name.trim() !== '' &&
        formData.email.trim() !== '' &&
        (
            formData.name !== (user?.name || '') ||
            formData.email !== (user?.email || '') ||
            JSON.stringify(formData.preferences || {}) !== JSON.stringify(user?.preferences || {})
        )

    const { name, email } = formData

    const handleSubmit = async (event) => {
        event.preventDefault()

        resetUpdateUserProfile()

        if (!hasChanges) {
            return
        }

        const newErrors = validateProfileForm({ name, email })

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        await updateUserProfile(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="profile-tab-form">
            <ProfileSection
                title="Informações pessoais"
                description="Atualize seus dados de acesso e identificação."
            >
                <ProfileUserSummary user={user} />

                <div className="profile-fields">
                    <Input
                        label="Nome"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        autoComplete="name"
                        error={errors.name}
                    />

                    <Input
                        label="E-mail"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        autoComplete="email"
                        error={errors.email}
                    />
                </div>
            </ProfileSection>

            <ProfileSection
                title="Preferências"
                description="Personalize sua experiência no sistema."
            >
                <div className="profile-preferences">
                    <Toggle
                        title="Tema escuro"
                        description="Ative o tema escuro para personalizar a aparência do sistema."
                        enabled={formData.preferences.theme === 'DARK'}
                        onChange={(checked) => setFormData((prev) => ({
                            ...prev,
                            preferences: {
                                ...prev.preferences,
                                theme: checked ? 'DARK' : 'LIGHT'
                            }
                        }))}
                    />
                </div>
            </ProfileSection>

            {updateUserProfileError && (
                <FormFeedback type="error">
                    {getErrorMessage(
                        updateUserProfileError,
                        'Não foi possível atualizar seus dados.'
                    )}
                </FormFeedback>
            )}

            {updateUserProfileSuccess && (
                <FormFeedback type="success">
                    Seus dados foram atualizados com sucesso.
                </FormFeedback>
            )}

            <div className="profile-form-actions">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={updatingUserProfile || !user || !hasChanges}
                >
                    {updatingUserProfile ? 'Salvando...' : 'Salvar alterações'}
                </Button>
            </div>
        </form>
    )
}