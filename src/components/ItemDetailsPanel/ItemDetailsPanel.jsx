import { useEffect, useId, useRef, useState } from 'react'
import { CalendarDays, FileText, FolderOpen, MessageCircle, X } from 'lucide-react'
import { Button } from '../Button/Button'
import { RichTextComposer } from '../RichTextComposer/RichTextComposer'
import { ItemActivityEntry } from '../ItemActivityEntry/ItemActivityEntry'
import { useCreateItemUpdate, useDeleteItemUpdate, useItemUpdates, useUpdateItemUpdate } from '../../hooks/useItemUpdate'
import { useComments, useCreateComment, useDeleteComment, useUpdateComment } from '../../hooks/useComment'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../utils/error'
import './ItemDetailsPanel.css'

const formatDate = (date) => {
    if (!date) return null

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return null

    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(parsedDate)
}

const buildActivityTree = (entries) => {
    const activeEntries = entries.filter((entry) => !entry.deleted_at)

    const nodes = activeEntries.map((entry) => ({
        ...entry,
        replies: []
    }))

    const nodesById = new Map(nodes.map((node) => [node.id, node]))

    const roots = []

    nodes.forEach((node) => {
        const parent = node.parent_id != null
            ? nodesById.get(node.parent_id)
            : null

        if (parent) {
            parent.replies.push(node)
        } else {
            roots.push(node)
        }
    })

    const sortByDate = (a, b) => {
        const dateA = Date.parse(a.created_at) || 0
        const dateB = Date.parse(b.created_at) || 0

        return dateB - dateA
    }

    const sortRecursively = (list) => {
        list.sort(sortByDate)

        list.forEach((entry) => {
            sortRecursively(entry.replies)
        })
    }

    sortRecursively(roots)

    return roots
}

export const ItemDetailsPanel = ({ item, sectionName, users = [], user, boardCreatorId, canCreateItemUpdate, canCreateComment, onTitleCommit, onClose }) => {
    const titleId = useId()
    const panelContentId = useId()

    const titleInputRef = useRef(null)
    const savingTitleRef = useRef(false)
    const ignoreTitleBlurRef = useRef(false)

    const [activeTab, setActiveTab] = useState('updates')

    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [titleDraft, setTitleDraft] = useState(item.title ?? '')
    const [isSavingTitle, setIsSavingTitle] = useState(false)

    const { data: itemUpdates = [] } = useItemUpdates(item.id)
    const { updateItemUpdate } = useUpdateItemUpdate()
    const { createItemUpdate } = useCreateItemUpdate()
    const { deleteItemUpdate } = useDeleteItemUpdate()

    const { data: comments = [] } = useComments(item.id)
    const { createComment } = useCreateComment()
    const { updateComment } = useUpdateComment()
    const { deleteComment } = useDeleteComment()

    const { error } = useToast()

    const isUpdatesTab = activeTab === 'updates'
    const currentActivities = isUpdatesTab ? itemUpdates : comments
    const activityTree = buildActivityTree(currentActivities)

    const canCreateActivity = isUpdatesTab
        ? canCreateItemUpdate
        : canCreateComment

    useEffect(() => {
        if (!isEditingTitle) {
            setTitleDraft(item.title ?? '')
        }
    }, [item.title, isEditingTitle])

    useEffect(() => {
        if (isEditingTitle) {
            titleInputRef.current?.focus()
            titleInputRef.current?.select()
        }
    }, [isEditingTitle])

    const handleStartTitleEdit = () => {
        if (savingTitleRef.current) return

        ignoreTitleBlurRef.current = false
        setTitleDraft(item.title ?? '')
        setIsEditingTitle(true)
    }

    const handleCancelTitleEdit = () => {
        if (savingTitleRef.current) return

        ignoreTitleBlurRef.current = true
        setTitleDraft(item.title ?? '')
        setIsEditingTitle(false)
    }

    const handleTitleCommit = async () => {
        if (savingTitleRef.current) return

        const nextTitle = titleDraft.trim()

        if (!nextTitle || nextTitle === item.title) {
            ignoreTitleBlurRef.current = true
            setTitleDraft(item.title ?? '')
            setIsEditingTitle(false)
            return
        }

        savingTitleRef.current = true
        setIsSavingTitle(true)

        try {
            await onTitleCommit({
                item,
                title: nextTitle
            })

            ignoreTitleBlurRef.current = true
            setIsEditingTitle(false)
        } catch {
            // O toast é tratado na BoardPage.
            // Mantém a edição aberta para uma nova tentativa.
        } finally {
            savingTitleRef.current = false
            setIsSavingTitle(false)
        }
    }

    const handleTitleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleTitleCommit()
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            handleCancelTitleEdit()
        }
    }

    const handleTitleBlur = () => {
        if (ignoreTitleBlurRef.current) {
            ignoreTitleBlurRef.current = false
            return
        }

        if (!savingTitleRef.current) {
            handleTitleCommit()
        }
    }

    const handleCreateActivity = async ({ content, parentId }) => {
        const payload = {
            itemId: item.id,
            content,
            parentId: parentId ?? null
        }

        if (isUpdatesTab) {
            await createItemUpdate(payload)

            return
        }

        await createComment(payload)
    }

    const handleEditActivity = async ({ entry, content }) => {
        if (isUpdatesTab) {
            await updateItemUpdate({
                itemUpdateId: entry.id,
                content
            })

            return
        }

        await updateComment({
            commentId: entry.id,
            content
        })
    }

    const handleDeleteActivity = async (entry) => {
        if (isUpdatesTab) {
            await deleteItemUpdate(entry.id)

            return
        }

        await deleteComment(entry.id)
    }

    const handleActivityError = (err, action) => {
        const activityType = isUpdatesTab
            ? 'atualização'
            : 'comentário'

        const actionLabels = {
            create: 'publicar',
            update: 'editar',
            delete: 'excluir'
        }

        error({
            title: `Erro ao ${actionLabels[action]} ${activityType}`,
            message: getErrorMessage(err)
        })
    }

    const createdAt = formatDate(item.created_at)

    return (
        <aside
            className="item-details-panel"
            aria-label={`Detalhes do item ${item.title}`}
        >
            <header className="item-details-panel-header">
                <div className="item-details-panel-header-info">
                    <span>DETALHES DO ITEM</span>

                    <small>Informações e atividade</small>
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    aria-label="Fechar painel de detalhes"
                    title="Fechar"
                    onClick={onClose}
                >
                    <X size={18} />
                </Button>
            </header>

            <div className="item-details-panel-body">
                <section className="item-details-panel-main">
                    <div className="item-details-panel-title-heading">
                        <span>TÍTULO</span>
                    </div>

                    {isEditingTitle ? (
                        <input
                            ref={titleInputRef}
                            id={titleId}
                            type="text"
                            className="item-details-panel-title-input"
                            value={titleDraft}
                            disabled={isSavingTitle}
                            onChange={(event) => setTitleDraft(event.target.value)}
                            onKeyDown={handleTitleKeyDown}
                            onBlur={handleTitleBlur}
                            data-no-drag="true"
                            aria-label="Editar título do item"
                        />
                    ) : (
                        <button
                            type="button"
                            id={titleId}
                            className="item-details-panel-title-trigger"
                            onClick={handleStartTitleEdit}
                            title="Clique para editar"
                        >
                            <h2>{item.title}</h2>
                        </button>
                    )}

                    <div className="item-details-panel-metadata">
                        {sectionName && (
                            <div className="item-details-panel-metadata-item">
                                <FolderOpen size={15} />
                                <span>{sectionName}</span>
                            </div>
                        )}

                        {createdAt && (
                            <div className="item-details-panel-metadata-item">
                                <CalendarDays size={15} />
                                <span>Criado em {createdAt}</span>
                            </div>
                        )}
                    </div>
                </section>

                <nav
                    className="item-details-panel-tabs"
                    role="tablist"
                    aria-label="Atividade do item"
                >
                    <Button
                        type="button"
                        role="tab"
                        variant="ghost"
                        className={isUpdatesTab ? 'is-active' : ''}
                        aria-selected={isUpdatesTab}
                        aria-controls={panelContentId}
                        onClick={() => setActiveTab('updates')}
                    >
                        <FileText size={15} />
                        Atualizações
                        <span className="item-details-panel-tab-count">
                            {itemUpdates.length}
                        </span>
                    </Button>

                    <Button
                        type="button"
                        role="tab"
                        variant="ghost"
                        className={!isUpdatesTab ? 'is-active' : ''}
                        aria-selected={!isUpdatesTab}
                        aria-controls={panelContentId}
                        onClick={() => setActiveTab('comments')}
                    >
                        <MessageCircle size={15} />
                        Comentários
                        <span className="item-details-panel-tab-count">
                            {comments.length}
                        </span>
                    </Button>
                </nav>

                <section
                    id={panelContentId}
                    className="item-details-panel-activity"
                    role="tabpanel"
                >
                    {canCreateActivity && (
                        <div className="item-details-panel-composer">
                            <RichTextComposer
                                key={activeTab}
                                itemId={item.id}
                                users={users}
                                clearOnSubmit
                                placeholder={isUpdatesTab ? 'Compartilhe uma atualização sobre este item...' : 'Escreva um comentário...'}
                                submitLabel={isUpdatesTab ? 'Publicar atualização' : 'Comentar'}
                                onSubmit={handleCreateActivity}
                                onError={(err) => handleActivityError(err, 'create')}
                            />
                        </div>
                    )}

                    <div className="item-details-panel-list">
                        {activityTree.length === 0 ? (
                            <div className="item-details-panel-empty">
                                {isUpdatesTab
                                    ? <FileText size={25} strokeWidth={1.6} />
                                    : <MessageCircle size={25} strokeWidth={1.6} />
                                }

                                <strong>
                                    {isUpdatesTab
                                        ? 'Nenhuma atualização ainda'
                                        : 'Nenhum comentário ainda'
                                    }
                                </strong>

                                <span>
                                    {isUpdatesTab
                                        ? 'As atualizações publicadas neste item aparecerão aqui.'
                                        : 'Os comentários deste item aparecerão aqui.'
                                    }
                                </span>
                            </div>
                        ) : (
                            activityTree.map((entry) => (
                                <ItemActivityEntry
                                    key={entry.id}
                                    entry={entry}
                                    users={users}
                                    itemId={item.id}
                                    activityType={activeTab}
                                    user={user}
                                    boardCreatorId={boardCreatorId}
                                    canCreateItemUpdate={canCreateItemUpdate}
                                    canCreateComment={canCreateComment}
                                    onReply={handleCreateActivity}
                                    onEdit={handleEditActivity}
                                    onDelete={handleDeleteActivity}
                                    onError={handleActivityError}
                                />
                            ))
                        )}
                    </div>
                </section>
            </div>
        </aside>
    )
}