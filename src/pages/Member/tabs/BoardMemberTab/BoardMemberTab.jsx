import { LayoutGrid } from 'lucide-react'
import { ProfileSection } from '../../../../components/ProfileSection/ProfileSection'
import './BoardMemberTab.css'

export const BoardMemberTab = () => {
    // TODO: Buscar os workspaces disponíveis.
    // TODO: Adicionar o estado do workspace selecionado.
    // TODO: Buscar os boards do workspace selecionado.
    // TODO: Adicionar o estado do board selecionado.
    // TODO: Buscar os membros do board selecionado.
    // TODO: Adicionar as mutations de inclusão, alteração e remoção de membros.

    return (
        <div className="member-tab-stack">
            <div className="board-member-tab-header">
                <div>
                    <h3>Membros de boards</h3>

                    <p>
                        Gerencie os usuários que têm acesso a cada board.
                    </p>
                </div>
            </div>

            <ProfileSection
                title="Selecionar board"
                description="Escolha o workspace e o board que deseja gerenciar."
            >
                <div className="board-member-tab-selectors">
                    <div className="board-member-tab-field">
                        <label htmlFor="board-member-workspace">
                            Workspace
                        </label>

                        <select
                            id="board-member-workspace"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Selecione um workspace
                            </option>

                            {/* TODO: Gerar as opções de workspace. */}
                        </select>
                    </div>

                    <div className="board-member-tab-field">
                        <label htmlFor="board-member-board">
                            Board
                        </label>

                        <select
                            id="board-member-board"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Selecione um board
                            </option>

                            {/* TODO: Gerar as opções de board conforme o workspace selecionado. */}
                        </select>
                    </div>
                </div>
            </ProfileSection>

            <ProfileSection
                title="Membros do board"
                description="Consulte e gerencie os usuários vinculados ao board selecionado."
            >
                {/* TODO: Exibir o botão para adicionar um membro ao board. */}
                {/* TODO: Renderizar a listagem dos membros do board. */}
                {/* TODO: Permitir alterar a role do membro no board. */}
                {/* TODO: Permitir remover um membro do board. */}

                <div className="member-placeholder-state">
                    <LayoutGrid size={26} strokeWidth={1.8} />

                    <h3>Selecione um board</h3>

                    <p>
                        Os membros e suas permissões serão exibidos aqui após
                        a seleção de um board.
                    </p>
                </div>
            </ProfileSection>
        </div>
    )
}