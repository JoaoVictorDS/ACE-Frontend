import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import { CreateWorkspaceModal } from '../../components/CreateWorkspaceModal/CreateWorkspaceModal'
import './AppLayout.css'

export const AppLayout = () => {
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false)

    const openCreateWorkspaceModal = () => {
        setShowCreateWorkspaceModal(true)
    }

    const closeCreateWorkspaceModal = () => {
        setShowCreateWorkspaceModal(false)
    }

    return (
        <div className="app-layout">
            <Header />
            <div className="app-layout-body">
                <Sidebar onCreateWorkspace={openCreateWorkspaceModal} />
                <main className="app-layout-main">
                    <Outlet context={{ openCreateWorkspaceModal }} />
                </main>
            </div>
            <CreateWorkspaceModal
                open={showCreateWorkspaceModal}
                onClose={closeCreateWorkspaceModal}
            />
        </div>
    )
}