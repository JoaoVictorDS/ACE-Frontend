import { useMemo, useState } from 'react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { createMentionExtension } from './mentionExtension'
import { Bold, Heading2, Heading3, Italic, List, ListOrdered, Quote, Redo2, Send, Strikethrough, Undo2 } from 'lucide-react'
import { Button } from '../Button/Button'
import './RichTextComposer.css'

const EMPTY_CONTENT = {
    type: 'doc',
    content: [{
        type: 'paragraph'
    }]
}

export const RichTextComposer = ({ itemId, users = [], parentId = null, initialContent = null, placeholder = 'Escreva aqui...', submitLabel = 'Publicar', clearOnSubmit = false, onSubmit, onCancel, onError }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)

    const extensions = useMemo(() => [
        StarterKit.configure({
            heading: {
                levels: [2, 3]
            }
        }),

        Placeholder.configure({
            placeholder
        }),

        createMentionExtension(users)
    ], [placeholder, users])

    const editor = useEditor({
        extensions,
        content: initialContent ?? EMPTY_CONTENT,
        editorProps: {
            attributes: {
                class: 'rich-text-composer-editor'
            }
        }
    })

    const editorState = useEditorState({
        editor,

        selector: ({ editor }) => ({
            isEmpty: !editor || !editor.getText().trim(),

            isBold: editor?.isActive('bold') ?? false,
            isItalic: editor?.isActive('italic') ?? false,
            isStrike: editor?.isActive('strike') ?? false,

            isHeading2: editor?.isActive('heading', { level: 2 }) ?? false,
            isHeading3: editor?.isActive('heading', { level: 3 }) ?? false,

            isBulletList: editor?.isActive('bulletList') ?? false,
            isOrderedList: editor?.isActive('orderedList') ?? false,
            isBlockquote: editor?.isActive('blockquote') ?? false,

            canUndo: editor?.can().undo() ?? false,
            canRedo: editor?.can().redo() ?? false
        }),

        equalityFn: (previous, next) => {
            if (!previous || !next) return previous === next

            return Object.keys(previous).every(
                (key) => previous[key] === next[key]
            )
        }
    })

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!editor || isSubmitting) return

        const text = editor.getText().trim()

        if (!text) return

        const payload = {
            itemId,
            parentId,
            content: editor.getJSON()
        }

        setIsSubmitting(true)
        setSubmitError(null)

        try {
            await onSubmit(payload)


            if (clearOnSubmit) {
                editor.commands.clearContent()
            }
        } catch (err) {
            if (onError) {
                onError(err)
            } else {
                setSubmitError('Não foi possível salvar o conteúdo. Tente novamente.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const isEmpty = editorState?.isEmpty ?? true

    return (
        <form
            className="rich-text-composer"
            onSubmit={handleSubmit}
        >
            <div className="rich-text-composer-toolbar">
                <div className="rich-text-composer-tools-group">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`rich-text-composer-tool ${editorState?.isBold ? 'is-active' : ''}`}
                        title="Negrito"
                        aria-label="Negrito"
                        aria-pressed={editorState?.isBold ?? false}
                        disabled={!editor || isSubmitting}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                        <Bold size={15} />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`rich-text-composer-tool ${editorState?.isItalic ? 'is-active' : ''}`}
                        title="Itálico"
                        aria-label="Itálico"
                        aria-pressed={editorState?.isItalic ?? false}
                        disabled={!editor || isSubmitting}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                    >
                        <Italic size={15} />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`rich-text-composer-tool ${editorState?.isStrike ? 'is-active' : ''}`}
                        title="Tachado"
                        aria-label="Tachado"
                        aria-pressed={editorState?.isStrike ?? false}
                        disabled={!editor || isSubmitting}
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                    >
                        <Strikethrough size={15} />
                    </Button>
                </div>

                <span className="rich-text-composer-toolbar-divider" />

                <div className="rich-text-composer-tools-group">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`rich-text-composer-tool ${editorState?.isHeading2 ? 'is-active' : ''}`}
                        title="Título 2"
                        aria-label="Título 2"
                        aria-pressed={editorState?.isHeading2 ?? false}
                        disabled={!editor || isSubmitting}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    >
                        <Heading2 size={15} />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`rich-text-composer-tool ${editorState?.isHeading3 ? 'is-active' : ''}`}
                        title="Título 3"
                        aria-label="Título 3"
                        aria-pressed={editorState?.isHeading3 ?? false}
                        disabled={!editor || isSubmitting}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    >
                        <Heading3 size={15} />
                    </Button>
                </div>

                <span className="rich-text-composer-toolbar-divider" />

                <div className="rich-text-composer-tools-group">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`rich-text-composer-tool ${editorState?.isBulletList ? 'is-active' : ''}`}
                        title="Lista não ordenada"
                        aria-label="Lista não ordenada"
                        aria-pressed={editorState?.isBulletList ?? false}
                        disabled={!editor || isSubmitting}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                    >
                        <List size={15} />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`rich-text-composer-tool ${editorState?.isOrderedList ? 'is-active' : ''}`}
                        title="Lista ordenada"
                        aria-label="Lista ordenada"
                        aria-pressed={editorState?.isOrderedList ?? false}
                        disabled={!editor || isSubmitting}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    >
                        <ListOrdered size={15} />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`rich-text-composer-tool ${editorState?.isBlockquote ? 'is-active' : ''}`}
                        title="Citação"
                        aria-label="Citação"
                        aria-pressed={editorState?.isBlockquote ?? false}
                        disabled={!editor || isSubmitting}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    >
                        <Quote size={15} />
                    </Button>
                </div>

                <span className="rich-text-composer-toolbar-spacer" />

                <div className="rich-text-composer-tools-group">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="rich-text-composer-tool"
                        title="Desfazer"
                        aria-label="Desfazer"
                        disabled={!editor || !editorState?.canUndo || isSubmitting}
                        onClick={() => editor.chain().focus().undo().run()}
                    >
                        <Undo2 size={15} />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="rich-text-composer-tool"
                        title="Refazer"
                        aria-label="Refazer"
                        disabled={!editor || !editorState?.canRedo || isSubmitting}
                        onClick={() => editor.chain().focus().redo().run()}
                    >
                        <Redo2 size={15} />
                    </Button>
                </div>
            </div>

            <div className="rich-text-composer-writing-area">
                <EditorContent editor={editor} />
            </div>

            {submitError && (
                <div className="rich-text-composer-error" role="alert">
                    {submitError}
                </div>
            )}

            <footer className="rich-text-composer-footer">
                <div className="rich-text-composer-footer-hint">
                    <span>Pressione Enter para criar um novo parágrafo. Para concluir, clique em "{submitLabel}".</span>
                </div>

                <div className="rich-text-composer-footer-actions">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={isEmpty || isSubmitting}
                    >
                        <Send size={14} />
                        {isSubmitting ? 'Enviando...' : submitLabel}
                    </Button>
                </div>
            </footer>
        </form>
    )
}