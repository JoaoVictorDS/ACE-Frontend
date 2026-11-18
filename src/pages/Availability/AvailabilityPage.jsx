import { useUser } from '../../hooks/useUser'
import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen'
import { AvailabilityAdminPage } from './admin/AvailabilityAdminPage'
import { AvailabilityMemberPage } from './member/AvailabilityMemberPage'
import './AvailabilityPage.css'

export const AvailabilityPage = () => {
    const { data: user, isLoading } = useUser()

    if (isLoading) {
        return <LoadingScreen />
    }

    return (
        <>
            {
                user?.role === 'ADMIN'
                    ? <AvailabilityAdminPage />
                    : <AvailabilityMemberPage />
            }
        </>
    )
}