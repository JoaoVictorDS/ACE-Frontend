import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import { CreateWorkspaceModal } from '../../components/CreateWorkspaceModal/CreateWorkspaceModal'
import { CreateBoardModal } from '../../components/CreateBoardModal/CreateBoardModal'
import './AppLayout.css'

export const AppLayout = () => {
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false)
    const [showCreateBoardModal, setShowCreateBoardModal] = useState(false)

    const openCreateWorkspaceModal = () => {
        setShowCreateWorkspaceModal(true)
    }

    const closeCreateWorkspaceModal = () => {
        setShowCreateWorkspaceModal(false)
    }

    const openCreateBoardModal = () => {
        setShowCreateBoardModal(true)
    }

    const closeCreateBoardModal = () => {
        setShowCreateBoardModal(false)
    }

    return (
        <div className="app-layout">
            <Header />
            <div className="app-layout-body">
                <Sidebar onCreateWorkspace={openCreateWorkspaceModal} onCreateBoard={openCreateBoardModal} />
                <main className="app-layout-main">
                    <Outlet context={{ openCreateWorkspaceModal, openCreateBoardModal }} />
                </main>
            </div>
            <CreateWorkspaceModal
                open={showCreateWorkspaceModal}
                onClose={closeCreateWorkspaceModal}
            />
            <CreateBoardModal
                open={showCreateBoardModal}
                onClose={closeCreateBoardModal}
            />
        </div>
    )
}