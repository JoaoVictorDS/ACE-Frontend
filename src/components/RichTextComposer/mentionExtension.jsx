import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Mention from '@tiptap/extension-mention'
import { ReactRenderer } from '@tiptap/react'
import { UserAvatar } from '../UserAvatar/UserAvatar'
import { normalizeText } from '../../utils/text'

const EMPTY_ITEMS = []

const MentionSuggestionList = forwardRef(({ items = EMPTY_ITEMS, command, query }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        setSelectedIndex(0)
    }, [query])

    const activeIndex = items.length > 0 ? Math.min(selectedIndex, items.length - 1) : 0

    useImperativeHandle(ref, () => ({
        onKeyDown({ event }) {
            if (items.length === 0) {
                return false
            }

            if (event.key === 'ArrowDown') {
                event.preventDefault()

                setSelectedIndex((current) => (current + 1) % items.length)

                return true
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault()

                setSelectedIndex((current) => (current - 1 + items.length) % items.length)

                return true
            }

            if (event.key === 'Enter') {
                event.preventDefault()

                command(items[activeIndex])

                return true
            }

            return false
        }
    }), [items, command, activeIndex])

    if (items.length === 0) {
        return (
            <div className="rich-text-mention-popup">
                <div className="rich-text-mention-empty">
                    Nenhum membro encontrado.
                </div>
            </div>
        )
    }

    return (
        <div
            className="rich-text-mention-popup"
            role="listbox"
            aria-label="Membros disponíveis"
        >
            {items.map((item, index) => {
                const isSelected = index === activeIndex

                return (
                    <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        className={[
                            'rich-text-mention-option',
                            isSelected && 'is-selected'
                        ].filter(Boolean).join(' ')}
                        onMouseDown={(event) => {
                            // Evita que o editor perca o foco antes da seleção.
                            event.preventDefault()
                        }}
                        onClick={() => command(item)}
                    >
                        <div className="rich-text-mention-avatar">
                            <UserAvatar user={item.user} />
                        </div>

                        <div className="rich-text-mention-info">
                            <strong>{item.label}</strong>
                        </div>
                    </button>
                )
            })}
        </div>
    )
})

MentionSuggestionList.displayName = 'MentionSuggestionList'

export const createMentionExtension = (users = []) => {
    const mentionableUsers = users
        .filter((member) => (
            member.user_id != null &&
            member.user?.name
        ))
        .map((member) => ({
            id: String(member.user_id),
            label: member.user.name,
            user: member.user
        }))

    return Mention.configure({
        HTMLAttributes: {
            class: 'rich-text-mention'
        },

        deleteTriggerWithBackspace: true,

        suggestion: {
            char: '@',
            allowSpaces: true,
            placement: 'bottom-start',

            offset: {
                mainAxis: 6,
                crossAxis: 0
            },

            items: ({ query }) => {
                const normalizedQuery = normalizeText(query)

                return mentionableUsers
                    .filter((member) => normalizeText(member.label).includes(normalizedQuery))
                    .slice(0, 8)
            },

            render: () => {
                let component = null
                let unmount = null

                return {
                    onStart(props) {
                        component = new ReactRenderer(
                            MentionSuggestionList,
                            {
                                props,
                                editor: props.editor
                            }
                        )

                        component.element.style.zIndex = '300'

                        unmount = props.mount(component.element)
                    },

                    onUpdate(props) {
                        component?.updateProps(props)
                    },

                    onKeyDown({ event }) {
                        return component?.ref?.onKeyDown({ event }) ?? false
                    },

                    onExit() {
                        unmount?.()

                        component?.destroy()

                        component = null
                        unmount = null
                    }
                }
            }
        }
    })
}