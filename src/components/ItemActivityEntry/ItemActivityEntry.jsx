import { useState } from 'react'
import { CornerUpLeft, Pencil, Trash2, UserRound } from 'lucide-react'
import { Button } from '../Button/Button'
import { RichTextComposer } from '../RichTextComposer/RichTextComposer'
import { getItemActivityPermissions } from '../../policies/itemActivityPolicy'
import './ItemActivityEntry.css'

const formatDateTime = (date) => {
    if (!date) return ''

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return ''

    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    }).format(parsedDate)
}

const getAuthorName = (entry, users) => {
    if (entry.user?.name) {
        return entry.user.name
    }

    const member = users.find(
        (item) => Number(item.user_id) === Number(entry.user_id)
    )

    return member?.user?.name ?? 'Usuário'
}

const getInitials = (name) => {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
}

const isSafeLink = (href) => {
    return typeof href === 'string' && /^(https?:\/\/|mailto:|tel:)/i.test(href)
}

const renderMarks = (content, marks = []) => {
    return marks.reduce((result, mark, index) => {
        switch (mark.type) {
            case 'bold':
                return <strong key={`bold-${index}`}>{result}</strong>

            case 'italic':
                return <em key={`italic-${index}`}>{result}</em>

            case 'strike':
                return <s key={`strike-${index}`}>{result}</s>

            case 'code':
                return <code key={`code-${index}`}>{result}</code>

            case 'underline':
                return <u key={`underline-${index}`}>{result}</u>

            case 'highlight':
                return <mark key={`highlight-${index}`}>{result}</mark>

            case 'link':
                return isSafeLink(mark.attrs?.href)
                    ? (
                        <a
                            key={`link-${index}`}
                            href={mark.attrs.href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {result}
                        </a>
                    )
                    : result

            default:
                return result
        }
    }, content)
}

const renderRichNode = (node, index = 0) => {
    if (node.type === 'text') {
        return renderMarks(node.text ?? '', node.marks)
    }

    if (node.type === 'mention') {
        const label = node.attrs?.label ?? 'usuário'

        return (
            <span className="item-activity-mention" key={`mention-${index}`}>
                @{label}
            </span>
        )
    }

    const children = (node.content ?? []).map((child, childIndex) =>
        renderRichNode(child, childIndex)
    )

    switch (node.type) {
        case 'doc':
            return <>{children}</>

        case 'paragraph':
            return <p key={`paragraph-${index}`}>{children}</p>

        case 'heading': {
            const level = [2, 3].includes(node.attrs?.level)
                ? node.attrs.level
                : 2

            const Tag = `h${level}`

            return <Tag key={`heading-${index}`}>{children}</Tag>
        }

        case 'bulletList':
            return <ul key={`bullet-${index}`}>{children}</ul>

        case 'orderedList':
            return <ol key={`ordered-${index}`}>{children}</ol>

        case 'listItem':
            return <li key={`item-${index}`}>{children}</li>

        case 'blockquote':
            return <blockquote key={`quote-${index}`}>{children}</blockquote>

        case 'codeBlock':
            return (
                <pre key={`code-block-${index}`}>
                    <code>{children}</code>
                </pre>
            )

        case 'hardBreak':
            return <br key={`break-${index}`} />

        case 'horizontalRule':
            return <hr key={`rule-${index}`} />

        default:
            return <>{children}</>
    }
}

export const RichTextContent = ({ content }) => {
    if (!content) return null

    if (content.type !== 'doc') {
        return null
    }

    return (
        <div className="item-activity-rich-content">
            {renderRichNode(content)}
        </div>
    )
}

export const ItemActivityEntry = ({ entry, users = [], activityType, itemId, user, boardCreatorId, canCreateItemUpdate, canCreateComment, onReply, onEdit, onDelete, onError, depth = 0 }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [isReplying, setIsReplying] = useState(false)
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

    const authorName = getAuthorName(entry, users)

    const { canReply, canEdit, canDelete } = getItemActivityPermissions({
        activityType,
        entry,
        user,
        boardCreatorId,
        canCreateItemUpdate,
        canCreateComment
    })

    const handleEditSubmit = async ({ content }) => {
        await onEdit({
            entry,
            content
        })

        setIsEditing(false)
    }

    const handleReplySubmit = async (payload) => {
        await onReply(payload)

        setIsReplying(false)
    }

    const handleDelete = async () => {
        try {
            await onDelete(entry)

            setIsConfirmingDelete(false)
        } catch (err) {
            onError?.(err, 'delete')
        }
    }

    return (
        <article
            className="item-activity-entry"
            data-depth={Math.min(depth, 4)}
        >
            <header className="item-activity-entry-header">
                <div className="item-activity-entry-avatar">
                    {entry.user?.avatar_url
                        ? (
                            <img
                                src={entry.user.avatar_url}
                                alt=""
                            />
                        )
                        : getInitials(authorName) || <UserRound size={15} />
                    }
                </div>

                <div className="item-activity-entry-author">
                    <strong>{authorName}</strong>

                    <time dateTime={entry.created_at}>
                        {formatDateTime(entry.created_at)}
                        {entry.updated_at !== entry.created_at && ' · Editado'}
                    </time>
                </div>

                <div className="item-activity-entry-actions">
                    {!isEditing && !isReplying && (
                        <>
                            {canReply && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    title="Responder"
                                    aria-label="Responder"
                                    onClick={() => {
                                        setIsReplying(true)
                                        setIsConfirmingDelete(false)
                                    }}
                                >
                                    <CornerUpLeft size={14} />
                                </Button>
                            )}

                            {canEdit && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    title="Editar"
                                    aria-label="Editar"
                                    onClick={() => {
                                        setIsEditing(true)
                                        setIsReplying(false)
                                        setIsConfirmingDelete(false)
                                    }}
                                >
                                    <Pencil size={14} />
                                </Button>
                            )}

                            {canDelete && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    title="Excluir"
                                    aria-label="Excluir"
                                    onClick={() => setIsConfirmingDelete(true)}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </header>

            {isEditing ? (
                <div className="item-activity-entry-editor">
                    <RichTextComposer
                        key={`edit-${entry.id}`}
                        itemId={itemId}
                        users={users}
                        initialContent={entry.content}
                        placeholder="Edite seu conteúdo..."
                        submitLabel="Salvar alterações"
                        onSubmit={handleEditSubmit}
                        onCancel={() => setIsEditing(false)}
                        onError={(err) => onError?.(err, 'update')}
                    />
                </div>
            ) : (
                <div className="item-activity-entry-content">
                    <RichTextContent content={entry.content} />
                </div>
            )}

            {isConfirmingDelete && (
                <div className="item-activity-entry-confirm">
                    <span>Deseja excluir este registro?</span>

                    <div>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsConfirmingDelete(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={handleDelete}
                        >
                            Excluir
                        </Button>
                    </div>
                </div>
            )}

            {isReplying && (
                <div className="item-activity-entry-reply-form">
                    <RichTextComposer
                        key={`reply-${entry.id}`}
                        itemId={itemId}
                        users={users}
                        parentId={entry.id}
                        placeholder={`Responder a ${authorName}...`}
                        submitLabel="Responder"
                        onSubmit={handleReplySubmit}
                        onCancel={() => setIsReplying(false)}
                        onError={(err) => onError?.(err, 'create')}
                    />
                </div>
            )}

            {entry.replies?.length > 0 && (
                <div className="item-activity-entry-replies">
                    {entry.replies.map((reply) => (
                        <ItemActivityEntry
                            key={reply.id}
                            entry={reply}
                            users={users}
                            activityType={activityType}
                            itemId={itemId}
                            user={user}
                            boardCreatorId={boardCreatorId}
                            canCreateItemUpdate={canCreateItemUpdate}
                            canCreateComment={canCreateComment}
                            onReply={onReply}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onError={onError}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </article>
    )
}