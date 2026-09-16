import { useEffect, useState } from 'react'
import { Button } from '../../../../components/Button/Button'
import { ProfileSection } from '../../../../components/ProfileSection/ProfileSection'
import { NotificationToggleList } from '../../../../components/NotificationToggleList/NotificationToggleList'
import { useUserNotificationSettings } from '../../../../hooks/useUserNotificationSettings'
import './NotificationsTab.css'
import { FormFeedback } from '../../../../components/FormFeedback/FormFeedback'
import { getErrorMessage } from '../../../../utils/error'

export const NotificationsTab = () => {
    const { data: userNotificationSettings = [], resetUpdateUserNotificationSettings, updateUserNotificationSettings, updatingUserNotificationSettings, updateUserNotificationSettingsError, updateUserNotificationSettingsSuccess } = useUserNotificationSettings()
    const [globalSettings, setGlobalSettings] = useState([])

    useEffect(() => {
        setGlobalSettings(userNotificationSettings)
    }, [userNotificationSettings])

    const handleGlobalChange = (actionType, enabled) => {
        setGlobalSettings((current) => current.map((setting) => setting.action_type === actionType
            ? { ...setting, enabled }
            : setting
        ))
    }

    const hasChanges = JSON.stringify(globalSettings) !== JSON.stringify(userNotificationSettings)

    const handleSubmit = async (event) => {
        event.preventDefault()

        resetUpdateUserNotificationSettings()

        if (!hasChanges) {
            return
        }

        await updateUserNotificationSettings({ settings: globalSettings })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="profile-tab-form"
        >
            <ProfileSection
                title="Notificações"
                description="Escolha quais atividades devem gerar notificações para você."
            >
                <NotificationToggleList
                    settings={globalSettings}
                    onChange={handleGlobalChange}
                />
            </ProfileSection>

            {updateUserNotificationSettingsError && (
                <FormFeedback type="error">
                    {getErrorMessage(
                        updateUserNotificationSettingsError,
                        'Não foi possível atualizar as configurações de notificações.'
                    )}
                </FormFeedback>
            )}

            {updateUserNotificationSettingsSuccess && (
                <FormFeedback type="success">
                    Suas configurações de notificações foram atualiadas com sucesso.
                </FormFeedback>
            )}

            <div className="profile-form-actions">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={updatingUserNotificationSettings || !hasChanges}
                >
                    {updatingUserNotificationSettings ? 'Salvando...' : 'Salvar alterações'}
                </Button>
            </div>
        </form>
    )
}