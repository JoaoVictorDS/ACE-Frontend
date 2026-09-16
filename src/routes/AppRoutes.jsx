import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AppLayout } from '../layouts/AppLayout/AppLayout'
import { LoginPage } from '../pages/Auth/LoginPage'
import { DashboardPage } from '../pages/Dashboard/DashboardPage'
import { ProfilePage } from '../pages/Profile/ProfilePage'
import { ProfileTab } from '../pages/Profile/tabs/Profile/ProfileTab'
import { NotificationsTab } from '../pages/Profile/tabs/Notifications/NotificationsTab'
import { SecurityTab } from '../pages/Profile/tabs/Security/SecurityTab'
import { AccountTab } from '../pages/Profile/tabs/Account/AccountTab'

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />}>
                        <Route index element={<ProfileTab />} />
                        <Route path="notifications" element={<NotificationsTab />} />
                        <Route path="security" element={<SecurityTab />} />
                        <Route path="account" element={<AccountTab />} />
                    </Route>
                </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}
