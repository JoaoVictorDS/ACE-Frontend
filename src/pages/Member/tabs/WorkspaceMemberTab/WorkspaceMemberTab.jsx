import { Building2 } from 'lucide-react'
import { ProfileSection } from '../../../../components/ProfileSection/ProfileSection'
import './WorkspaceMemberTab.css'

export const WorkspaceMemberTab = () => {
    // TODO: Buscar os workspaces disponíveis para gerenciamento.
    // TODO: Adicionar o estado do workspace selecionado.
    // TODO: Buscar os membros do workspace selecionado.
    // TODO: Adicionar as mutations de inclusão, alteração e remoção de membros.

    return (
        <div className="member-tab-stack">
            <div className="workspace-member-tab-header">
                <div>
                    <h3>Membros de workspaces</h3>

                    <p>
                        Gerencie os usuários que têm acesso a cada workspace.
                    </p>
                </div>
            </div>

            <ProfileSection
                title="Selecionar workspace"
                description="Escolha o workspace cujos membros deseja gerenciar."
            >
                <div className="workspace-member-tab-selector">
                    <label htmlFor="workspace-member-selector">
                        Workspace
                    </label>

                    <select
                        id="workspace-member-selector"
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Selecione um workspace
                        </option>

                        {/* TODO: Gerar as opções com os workspaces disponíveis. */}
                    </select>
                </div>
            </ProfileSection>

            <ProfileSection
                title="Membros do workspace"
                description="Consulte e gerencie os vínculos dos usuários com o workspace selecionado."
            >
                {/* TODO: Exibir o botão para adicionar um membro. */}
                {/* TODO: Renderizar a listagem dos membros do workspace. */}
                {/* TODO: Permitir alterar a role do membro no workspace. */}
                {/* TODO: Permitir remover um membro do workspace. */}

                <div className="member-placeholder-state">
                    <Building2 size={26} strokeWidth={1.8} />

                    <h3>Selecione um workspace</h3>

                    <p>
                        Os membros e suas permissões serão exibidos aqui após
                        a seleção de um workspace.
                    </p>
                </div>
            </ProfileSection>
        </div>
    )
}