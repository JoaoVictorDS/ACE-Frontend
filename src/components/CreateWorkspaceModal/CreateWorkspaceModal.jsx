import { useState } from 'react'
import { useWorkspace } from '../../hooks/useWorkspace'
import { Button } from '../Button/Button'
import { FormFeedback } from '../FormFeedback/FormFeedback'
import { getErrorMessage } from '../../utils/error'
import { useNavigate } from 'react-router-dom'
import './CreateWorkspaceModal.css'

export const CreateWorkspaceModal = ({ open, onClose }) => {
    const [workspaceName, setWorkspaceName] = useState('')
    const { creatingWorkspace: isLoading, resetCreateWorkspace, createWorkspace, createWorkspaceError } = useWorkspace()
    const navigate = useNavigate()

    if (!open) {
        return null
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        resetCreateWorkspace()

        const name = workspaceName.trim()

        if (!name || isLoading) {
            return
        }

        const createdWorkspace = await createWorkspace({ name })

        setWorkspaceName('')
        onClose()

        navigate(`/workspaces/${createdWorkspace.id}`)
    }

    const handleClose = () => {
        if (isLoading) {
            return
        }

        resetCreateWorkspace()
        setWorkspaceName('')
        onClose()
    }

    return (
        <div
            className="create-workspace-modal-overlay"
            onClick={handleClose}
        >
            <div
                className="create-workspace-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="create-workspace-modal-header">
                    <div>
                        <h3>Criar novo workspace</h3>

                        <p>
                            Crie um workspace para organizar seus
                            projetos e boards.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="create-workspace-modal-close"
                        onClick={handleClose}
                        disabled={isLoading}
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="create-workspace-modal-body">
                        <label
                            htmlFor="workspace-name"
                            className="create-workspace-modal-label"
                        >
                            Nome do workspace
                        </label>

                        <input
                            id="workspace-name"
                            type="text"
                            className="create-workspace-modal-input"
                            placeholder="Ex: Meu Projeto"
                            value={workspaceName}
                            onChange={(event) => setWorkspaceName(event.target.value)}
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    {createWorkspaceError && (
                        <div className="create-workspace-modal-feedback">
                            <FormFeedback type="error">
                                {getErrorMessage(
                                    createWorkspaceError,
                                    'Não foi possível criar o workspace.'
                                )}
                            </FormFeedback>
                        </div>
                    )}

                    <div className="create-workspace-modal-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading || !workspaceName.trim()}
                        >
                            {isLoading ? 'Criando...' : 'Criar Workspace'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
