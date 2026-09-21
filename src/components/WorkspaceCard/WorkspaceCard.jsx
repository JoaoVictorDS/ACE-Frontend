import { ArrowRight, Building2 } from 'lucide-react'
import './WorkspaceCard.css'

export const WorkspaceCard = ({ workspace, onClick }) => {
    return (
        <button
            type="button"
            className="workspace-card"
            onClick={() => onClick(workspace)}
        >
            <div className="workspace-card-top">
                <div className="workspace-card-icon">
                    {workspace.icon
                        ? (workspace.icon)
                        : (<Building2 size={24} strokeWidth={2} />)
                    }
                </div>

                <div className="workspace-card-arrow">
                    <ArrowRight size={17} strokeWidth={2} />
                </div>
            </div>

            <div className="workspace-card-content">
                <h3 className="workspace-card-title">
                    {workspace.name}
                </h3>

                <p className="workspace-card-description">
                    {workspace.description || 'Sem descrição'}
                </p>
            </div>

            <div className="workspace-card-footer">
                <span className="workspace-card-role">
                    {workspace.user_role}
                </span>

                <span className="workspace-card-access">
                    Acessar workspace
                </span>
            </div>
        </button>
    )
}