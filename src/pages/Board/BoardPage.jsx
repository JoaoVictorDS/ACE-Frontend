import { useParams } from 'react-router-dom'
import { useBoard } from '../../hooks/useBoard'
import { useUpdateItemTitle } from '../../hooks/useItem'
import { useUpsertItemValue } from '../../hooks/useItemValue'
import { useBoardMembers, useUpdateBoardMemberPreferences } from '../../hooks/useBoardMember'
import { useToast } from '../../hooks/useToast'
import { BoardSocketListener } from '../../listeners/BoardSocketListener/BoardSocketListener'
import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen'
import { AlertCircle, Ellipsis, LayoutGrid, RefreshCcw } from 'lucide-react'
import { BoardToolbar } from '../../components/BoardToolbar/BoardToolbar'
import { BoardTable } from '../../components/BoardTable/BoardTable'
import { FeedbackState } from '../../components/FeedbackState/FeedbackState'
import { Button } from '../../components/Button/Button'
import { getErrorMessage } from '../../utils/error'
import './BoardPage.css'

export const BoardPage = () => {
    const { boardId } = useParams()

    const { data: board = {}, isLoading: boardLoading, error: boardError, refetch: refetchBoard } = useBoard(boardId)
    const { data: boardMembers = [] } = useBoardMembers(boardId)
    const { updateItemTitle } = useUpdateItemTitle()
    const { upsertItemValue } = useUpsertItemValue()
    const { updateBoardMemberPreferences } = useUpdateBoardMemberPreferences(boardId)
    const { error } = useToast()

    if (boardLoading) {
        return <LoadingScreen />
    }

    if (boardError) {
        return (
            <FeedbackState
                icon={<AlertCircle size={22} strokeWidth={2} />}
                title="Não foi possível carregar o board"
                message={getErrorMessage(boardError)}
                action={
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => refetchBoard()}
                    >
                        <RefreshCcw size={16} />
                        Tentar novamente
                    </Button>
                }
            />
        )
    }

    const totalItems = board.sections.reduce((total, section) => total + section.items.length, 0)

    const handleItemOpen = (item) => {
        console.log('Abrir item:', item.id)
    }

    const handleItemTitleCommit = async (item, title) => {
        try {
            await updateItemTitle({
                itemId: item.id,
                title
            })
        } catch (err) {
            error({
                title: 'Erro ao salvar o título do item',
                message: getErrorMessage(err)
            })
        }
    }

    const handleCellCommit = async ({ item, column, value }) => {
        try {
            await upsertItemValue({
                itemId: item.id,
                columnId: column.id,
                value
            })
        } catch (err) {
            error({
                title: 'Erro ao salvar dados',
                message: getErrorMessage(err)
            })
        }
    }

    return (
        <div className="board-page">
            <BoardSocketListener boardId={boardId} />
            <div className="board-page-header">
                <div className="board-page-heading">
                    <div
                        className="board-page-icon"
                        style={{ backgroundColor: board.color ?? '#3b82f6' }}
                    >
                        <LayoutGrid size={20} strokeWidth={2} />
                    </div>

                    <div className="board-page-title-group">
                        <div className="board-page-breadcrumb">
                            Workspace / Boards
                        </div>

                        <div className="board-page-title-row">
                            <h1>{board.name}</h1>

                            <span className="board-page-item-count">
                                {totalItems} {totalItems <= 1 ? board.item_label_singular : board.item_label_plural}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="board-page-actions">
                    <button
                        type="button"
                        className="board-page-more"
                        aria-label="Mais opções do board"
                    >
                        <Ellipsis size={19} />
                    </button>
                </div>
            </div>

            <BoardToolbar board={board} />

            <main className="board-page-content">
                <BoardTable
                    board={board}
                    users={boardMembers}
                    onItemTitleCommit={handleItemTitleCommit}
                    onItemOpen={handleItemOpen}
                    onCellCommit={handleCellCommit}
                    onUpdatePreferences={updateBoardMemberPreferences}
                />
            </main>
        </div>
    )
}