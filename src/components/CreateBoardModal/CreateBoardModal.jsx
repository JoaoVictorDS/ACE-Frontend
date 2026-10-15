import { useState } from 'react'
import { useCreateBoard } from '../../hooks/useBoard'
import { Button } from '../Button/Button'
import { FormFeedback } from '../FormFeedback/FormFeedback'
import { getErrorMessage } from '../../utils/error'
import { useNavigate, useParams } from 'react-router-dom'
import './CreateBoardModal.css'

export const CreateBoardModal = ({ open, onClose }) => {
    const { workspaceId } = useParams()

    const [boardName, setBoardName] = useState('')
    const { createBoard, creatingBoard, createBoardError, resetCreateBoard } = useCreateBoard()
    const navigate = useNavigate()

    if (!open) {
        return null
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        resetCreateBoard()

        const name = boardName.trim()

        if (!name || !workspaceId || creatingBoard) {
            return
        }

        const createdBoard = await createBoard({
            workspaceId,
            data: { name }
        })

        setBoardName('')
        onClose()

        navigate(`/workspaces/${workspaceId}/boards/${createdBoard.id}`)
    }

    const handleClose = () => {
        if (creatingBoard) {
            return
        }

        resetCreateBoard()
        setBoardName('')
        onClose()
    }

    return (
        <div
            className="create-board-modal-overlay"
            onClick={handleClose}
        >
            <div
                className="create-board-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="create-board-modal-header">
                    <div>
                        <h3>Criar novo board</h3>

                        <p>
                            Crie um board para organizar os itens
                            e as colunas do seu projeto.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="create-board-modal-close"
                        onClick={handleClose}
                        disabled={creatingBoard}
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="create-board-modal-body">
                        <label
                            htmlFor="board-name"
                            className="create-board-modal-label"
                        >
                            Nome do board
                        </label>

                        <input
                            id="board-name"
                            type="text"
                            className="create-board-modal-input"
                            placeholder="Ex: Planejamento do projeto"
                            value={boardName}
                            onChange={(event) => setBoardName(event.target.value)}
                            disabled={creatingBoard}
                            autoFocus
                        />
                    </div>

                    {createBoardError && (
                        <div className="create-board-modal-feedback">
                            <FormFeedback type="error">
                                {getErrorMessage(
                                    createBoardError,
                                    'Não foi possível criar o board.'
                                )}
                            </FormFeedback>
                        </div>
                    )}

                    <div className="create-board-modal-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={creatingBoard}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={
                                creatingBoard ||
                                !boardName.trim() ||
                                !workspaceId
                            }
                        >
                            {creatingBoard ? 'Criando...' : 'Criar board'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}