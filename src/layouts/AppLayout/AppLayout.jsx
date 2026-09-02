import { Outlet } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import './AppLayout.css'

export const AppLayout = () => {
    return (
        <div className="app-layout">
            <Header />
            <main className="app-layout-main">
                <Outlet />
            </main>
        </div>
    )
}
