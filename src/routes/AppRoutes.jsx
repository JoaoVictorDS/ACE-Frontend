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
import { WorkspacePage } from '../pages/Workspace/WorkspacePage'

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
                    <Route path="/workspaces/:workspaceId" element={<WorkspacePage />} />
                    <Route path="/workspaces/:workspaceId/boards/:boardId" element={<h1>BoardPage</h1>} />
                </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}
