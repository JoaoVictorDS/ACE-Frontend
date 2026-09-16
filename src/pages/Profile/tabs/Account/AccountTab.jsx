import { ProfileSection } from '../../../../components/ProfileSection/ProfileSection'
import './AccountTab.css'

export const AccountTab = () => {
    return (
        <div className="profile-tab-stack">

            <ProfileSection
                title="Conta"
                description="Gerencie configurações relacionadas à sua conta."
            >
                <div className="profile-account-placeholder">
                    <strong>
                        Configurações da conta
                    </strong>

                    <p>
                        Esta área está reservada para futuras
                        configurações da sua conta.
                    </p>
                </div>
            </ProfileSection>

        </div>
    )
}