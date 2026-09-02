import { Outlet } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import './AppLayout.css'

export const AppLayout = () => {
    return (
        <div className="app-layout">
            <Header />
            <div className="app-layout-body">
                <Sidebar />
                <main className="app-layout-main">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}