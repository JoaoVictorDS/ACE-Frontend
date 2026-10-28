import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBoard } from '../../hooks/useBoard'
import { useUpdateItemTitle, useCreateItem, useDeleteItem, useMoveItem } from '../../hooks/useItem'
import { useUpsertItemValue } from '../../hooks/useItemValue'
import { useBoardMembers, useUpdateBoardMemberPreferences } from '../../hooks/useBoardMember'
import { useCreateSection, useUpdateSectionName, useMoveSection, useDeleteSection } from '../../hooks/useSection'
import { useCreateColumn, useDeleteColumn, useMoveColumn, useUpdateColumn } from '../../hooks/useColumn'
import { useToast } from '../../hooks/useToast'
import { BoardSocketListener } from '../../listeners/BoardSocketListener/BoardSocketListener'
import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen'
import { AlertCircle, Ellipsis, LayoutGrid, RefreshCcw } from 'lucide-react'
import { BoardToolbar } from '../../components/BoardToolbar/BoardToolbar'
import { BoardTable } from '../../components/BoardTable/BoardTable'
import { ColumnFormModal } from '../../components/ColumnFormModal/ColumnFormModal'
import { FeedbackState } from '../../components/FeedbackState/FeedbackState'
import { Button } from '../../components/Button/Button'
import { ConfirmDialog } from '../../components/ConfirmDialog/ConfirmDialog'
import { getErrorMessage } from '../../utils/error'
import './BoardPage.css'

export const BoardPage = () => {
    const { boardId } = useParams()

    const { data: board = {}, isLoading: boardLoading, error: boardError, refetch: refetchBoard } = useBoard(boardId)
    const { data: boardMembers = [] } = useBoardMembers(boardId)

    const { updateItemTitle } = useUpdateItemTitle()
    const { createItem } = useCreateItem(boardId)
    const { deleteItem } = useDeleteItem()
    const { moveItem } = useMoveItem()

    const { upsertItemValue } = useUpsertItemValue()

    const { createSection } = useCreateSection()
    const { updateSectionName } = useUpdateSectionName()
    const { moveSection } = useMoveSection()
    const { deleteSection, deletingSection, resetDeleteSection } = useDeleteSection()

    const { createColumn } = useCreateColumn()
    const { updateColumn, updatingColumn, resetUpdateColumn } = useUpdateColumn()
    const { moveColumn } = useMoveColumn()
    const { deleteColumn, deletingColumn, resetDeleteColumn } = useDeleteColumn()

    const { updateBoardMemberPreferences } = useUpdateBoardMemberPreferences(boardId)

    const { error } = useToast()

    const [isColumnFormModalOpen, setIsColumnFormModalOpen] = useState(false)
    const [columnBeingEdited, setColumnBeingEdited] = useState(null)
    const [columnPendingDelete, setColumnPendingDelete] = useState(null)
    const [columnPendingDataTypeChange, setColumnPendingDataTypeChange] = useState(null)

    const [addItemSectionId, setAddItemSectionId] = useState(null)
    const [addSectionOpen, setAddSectionOpen] = useState(false)
    const [selectedItemIds, setSelectedItemIds] = useState([])
    const [sectionPendingDelete, setSectionPendingDelete] = useState(null)

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
    const visibleItemIds = board.sections?.flatMap((section) => section.items.filter((item) => !item.deleted_at).map((item) => item.id)) ?? []
    const selectedVisibleItemIds = selectedItemIds.filter((itemId) => visibleItemIds.includes(itemId))
    const allItemsSelected = visibleItemIds.length > 0 && visibleItemIds.every((itemId) => selectedItemIds.includes(itemId))
    const someItemsSelected = selectedVisibleItemIds.length > 0 && !allItemsSelected

    const handleOpenAddItem = (sectionId) => {
        setAddItemSectionId(sectionId)
    }

    const handleCloseAddItem = () => {
        setAddItemSectionId(null)
    }

    const handleOpenAddSection = () => {
        setAddSectionOpen(true)
    }

    const handleCloseAddSection = () => {
        setAddSectionOpen(false)
    }

    const handleItemOpen = (item) => {
        console.log('Abrir item:', item.id)
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

    const handleItemTitleCommit = async ({ item, title }) => {
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

    const handleCreateItem = async ({ sectionId, title }) => {
        try {
            await createItem({
                sectionId,
                title
            })
        } catch (err) {
            error({
                title: 'Erro ao criar o item',
                message: getErrorMessage(err)
            })
        }
    }

    const handleDeleteItem = async (item) => {
        try {
            await deleteItem(item.id)

            setSelectedItemIds((current) => current.filter((id) => id !== item.id))
        } catch (err) {
            error({
                title: 'Erro ao deletar o item',
                message: getErrorMessage(err)
            })
        }
    }

    const handleMoveItem = async (payload) => {
        try {
            await moveItem(payload)
        } catch (err) {
            error({
                title: 'Erro ao mover o item',
                message: getErrorMessage(err)
            })
        }
    }

    const handleCreateSection = async (name) => {
        try {
            await createSection({
                boardId,
                name
            })
        } catch (err) {
            error({
                title: 'Erro ao criar a seção',
                message: getErrorMessage(err)
            })
        }
    }

    const handleSectionNameCommit = async ({ section, name }) => {
        try {
            await updateSectionName({
                sectionId: section.id,
                name
            })
        } catch (err) {
            error({
                title: 'Erro ao salvar o nome da seção',
                message: getErrorMessage(err)
            })
        }
    }

    const handleMoveSection = async ({ sectionId, newOrder }) => {
        try {
            await moveSection({
                sectionId,
                newOrder
            })

        } catch (err) {
            error({
                title: 'Erro ao mover a seção',
                message: getErrorMessage(err)
            })
        }
    }

    const handleDeleteSection = (section) => {
        resetDeleteSection()
        setSectionPendingDelete(section)
    }

    const handleConfirmDeleteSection = async () => {
        if (!sectionPendingDelete || deletingSection) {
            return
        }

        const section = sectionPendingDelete

        try {
            await deleteSection(section.id)

            const deletedItemIds = new Set((section.items ?? []).map((item) => String(item.id)))

            setSelectedItemIds((current) => (current.filter((itemId) => (!deletedItemIds.has(String(itemId))))))
        } catch (err) {
            error({
                title: 'Erro ao excluir a seção',
                message: getErrorMessage(err)
            })
        } finally {
            setSectionPendingDelete(null)
        }
    }

    const handleCancelDeleteSection = () => {
        setSectionPendingDelete(null)
    }

    const handleCreateColumn = () => {
        setColumnBeingEdited(null)
        setIsColumnFormModalOpen(true)
    }

    const handleEditColumn = (column) => {
        setColumnBeingEdited(column)
        setIsColumnFormModalOpen(true)
    }

    const handleCloseColumnModal = () => {
        setIsColumnFormModalOpen(false)
        setColumnBeingEdited(null)
    }

    const handleSubmitColumn = async (payload) => {
        const { column_id } = payload

        if (column_id) {
            const hasDataTypeChanged = columnBeingEdited?.id === column_id && payload.data_type != null && payload.data_type !== columnBeingEdited.data_type

            if (hasDataTypeChanged) {
                resetUpdateColumn()

                setColumnPendingDataTypeChange({
                    column: columnBeingEdited,
                    payload,
                })

                return
            }

            try {
                await updateColumn({
                    columnId: column_id,
                    data: payload,
                })
            } catch (err) {
                error({
                    title: 'Erro ao atualizar a coluna',
                    message: getErrorMessage(err),
                })
            }

            return
        }

        try {
            await createColumn({
                boardId,
                data: payload,
            })
        } catch (err) {
            error({
                title: 'Erro ao criar a coluna',
                message: getErrorMessage(err),
            })
        }
    }

    const handleConfirmColumnDataTypeChange = async () => {
        if (!columnPendingDataTypeChange || updatingColumn) {
            return
        }

        const { column, payload } = columnPendingDataTypeChange

        try {
            await updateColumn({
                columnId: column.id,
                data: payload,
            })
        } catch (err) {
            error({
                title: 'Erro ao atualizar o tipo da coluna',
                message: getErrorMessage(err),
            })
        } finally {
            setColumnPendingDataTypeChange(null)
        }
    }

    const handleCancelColumnDataTypeChange = () => {
        if (updatingColumn) {
            return
        }

        setColumnPendingDataTypeChange(null)
    }

    const handleColumnNameCommit = async ({ column, name }) => {
        try {
            await updateColumn({
                columnId: column.id,
                data: { name }
            })
        } catch (err) {
            error({
                title: 'Erro ao salvar o nome da coluna',
                message: getErrorMessage(err)
            })
        }
    }

    const handleConfigureColumnRestrictions = (column) => {
        console.log('Configurar restrições da coluna:', column)
    }

    const handleMoveColumn = async (payload) => {
        try {
            await moveColumn(payload)
        } catch (err) {
            error({
                title: 'Erro ao mover a coluna',
                message: getErrorMessage(err)
            })
        }
    }

    const handleDeleteColumn = (column) => {
        resetDeleteColumn()
        setColumnPendingDelete(column)
    }

    const handleConfirmDeleteColumn = async () => {
        if (!columnPendingDelete || deletingColumn) {
            return
        }

        try {
            await deleteColumn({
                columnId: columnPendingDelete.id,
                force: true
            })
        } catch (err) {
            error({
                title: 'Erro ao excluir a coluna',
                message: getErrorMessage(err)
            })
        } finally {
            setColumnPendingDelete(null)
        }
    }

    const handleCancelDeleteColumn = () => {
        setColumnPendingDelete(null)
    }

    const handleUpdatePreferences = async (preferences) => {
        try {
            await updateBoardMemberPreferences(preferences)
        } catch (err) {
            error({
                title: 'Erro ao salvar preferências',
                message: getErrorMessage(err)
            })
        }
    }

    const handleToggleItemSelection = (itemId) => {
        setSelectedItemIds((current) => {
            if (current.includes(itemId)) {
                return current.filter((id) => id !== itemId)
            }

            return [...current, itemId]
        })
    }

    const handleClearItemSelection = () => {
        setSelectedItemIds([])
    }

    const handleToggleAllItems = () => {
        setSelectedItemIds((current) => {
            if (allItemsSelected) {
                return []
            }

            return visibleItemIds
        })
    }

    const handleToggleSectionSelection = (itemIds) => {
        setSelectedItemIds((current) => {
            const allSelected =
                itemIds.length > 0 &&
                itemIds.every((itemId) => current.includes(itemId))

            if (allSelected) {
                return current.filter((id) => !itemIds.includes(id))
            }

            const newItemIds = itemIds.filter((itemId) => !current.includes(itemId))

            return [...current, ...newItemIds]
        })
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

            <BoardToolbar
                board={board}
                onNewItem={handleOpenAddItem}
                onNewSection={handleOpenAddSection}
            />

            <main className="board-page-content">
                <BoardTable
                    board={board}
                    users={boardMembers}
                    onItemTitleCommit={handleItemTitleCommit}
                    onItemOpen={handleItemOpen}
                    onCellCommit={handleCellCommit}
                    onUpdatePreferences={handleUpdatePreferences}
                    onCreateItem={handleCreateItem}
                    onDeleteItem={handleDeleteItem}
                    addItemSectionId={addItemSectionId}
                    onOpenAddItem={handleOpenAddItem}
                    onCloseAddItem={handleCloseAddItem}
                    selectedItemIds={selectedItemIds}
                    onToggleItemSelection={handleToggleItemSelection}
                    allItemsSelected={allItemsSelected}
                    someItemsSelected={someItemsSelected}
                    onToggleAllItems={handleToggleAllItems}
                    onToggleSectionSelection={handleToggleSectionSelection}
                    onMoveItem={handleMoveItem}
                    addSectionOpen={addSectionOpen}
                    onOpenAddSection={handleOpenAddSection}
                    onCloseAddSection={handleCloseAddSection}
                    onCreateSection={handleCreateSection}
                    onSectionNameCommit={handleSectionNameCommit}
                    onMoveSection={handleMoveSection}
                    onDeleteSection={handleDeleteSection}
                    onCreateColumn={handleCreateColumn}
                    onColumnNameCommit={handleColumnNameCommit}
                    onEditColumn={handleEditColumn}
                    onConfigureColumnRestrictions={handleConfigureColumnRestrictions}
                    onMoveColumn={handleMoveColumn}
                    onDeleteColumn={handleDeleteColumn}
                />
            </main>

            {sectionPendingDelete && (
                <ConfirmDialog
                    title="Excluir seção?"
                    message={`A seção "${sectionPendingDelete.name}" e todos os itens contidos nela serão excluídos. Esta ação não poderá ser desfeita.`}
                    confirmLabel="Excluir seção"
                    cancelLabel="Cancelar"
                    variant="danger"
                    isPending={deletingSection}
                    onConfirm={handleConfirmDeleteSection}
                    onCancel={handleCancelDeleteSection}
                />
            )}

            {columnPendingDelete && (
                <ConfirmDialog
                    title="Excluir coluna?"
                    message={`A coluna "${columnPendingDelete.name}" será removida do board, e os dados associados a ela serão excluídos permanentemente. Essa ação não poderá ser desfeita. Deseja continuar?`}
                    confirmLabel="Excluir coluna"
                    cancelLabel="Cancelar"
                    variant="danger"
                    isPending={deletingColumn}
                    onConfirm={handleConfirmDeleteColumn}
                    onCancel={handleCancelDeleteColumn}
                />
            )}

            {columnPendingDataTypeChange && (
                <ConfirmDialog
                    title="Alterar o tipo da coluna?"
                    message={`Alterar o tipo da coluna "${columnPendingDataTypeChange.column.name}" excluirá permanentemente os dados associados a ela, incluindo itens, valores, atualizações e comentários. Essa ação não poderá ser desfeita. Deseja continuar?`}
                    confirmLabel="Alterar tipo"
                    cancelLabel="Cancelar"
                    variant="danger"
                    isPending={updatingColumn}
                    onConfirm={handleConfirmColumnDataTypeChange}
                    onCancel={handleCancelColumnDataTypeChange}
                />
            )}

            {isColumnFormModalOpen && (
                <ColumnFormModal
                    key={columnBeingEdited?.id ?? 'new-column'}
                    column={columnBeingEdited}
                    onSubmit={handleSubmitColumn}
                    onClose={handleCloseColumnModal}
                />
            )}
        </div>
    )
}