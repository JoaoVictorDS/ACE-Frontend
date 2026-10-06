import { useEffect, useRef, useState } from 'react'
import { ArrowUpDown, ChevronDown, Filter, Plus, Search, Settings2 } from 'lucide-react'
import { Button } from '../Button/Button'
import './BoardToolbar.css'

export const BoardToolbar = ({ board, onNewItem }) => {
    const [showNewItemMenu, setShowNewItemMenu] = useState(false)
    const newItemRef = useRef(null)

    useEffect(() => {
        if (!showNewItemMenu) return

        const handlePointerDown = (event) => {
            if (!newItemRef.current?.contains(event.target)) {
                setShowNewItemMenu(false)
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
        }
    }, [showNewItemMenu])

    const sections = [...(board.sections ?? [])]
        .filter((section) => !section.deleted_at)
        .sort((a, b) => a.order - b.order)

    const handleSelectSection = (sectionId) => {
        onNewItem(sectionId)
        setShowNewItemMenu(false)
    }

    return (
        <div className="board-toolbar">
            <div className="board-toolbar-left">
                <div
                    ref={newItemRef}
                    className="board-toolbar-new-item"
                >
                    <Button
                        variant="primary"
                        type="button"
                        onClick={() => setShowNewItemMenu((current) => !current)}
                    >
                        <Plus size={16} />
                        Novo {board.item_label_singular}
                        <ChevronDown size={14} />
                    </Button>

                    {showNewItemMenu && (
                        <div className="board-toolbar-new-item-menu">
                            <div className="board-toolbar-new-item-menu-title">
                                Criar em
                            </div>

                            {sections.length === 0 && (
                                <div className="board-toolbar-new-item-menu-empty">
                                    Nenhuma seção disponível
                                </div>
                            )}

                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    type="button"
                                    className="board-toolbar-new-item-option"
                                    onClick={() => handleSelectSection(section.id)}
                                >
                                    <span>{section.name}</span>
                                    <span>{section.items.length}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="board-toolbar-action"
                >
                    <Filter size={16} />
                    Filtrar
                </button>

                <button
                    type="button"
                    className="board-toolbar-action"
                >
                    <ArrowUpDown size={16} />
                    Ordenar
                </button>

                <button
                    type="button"
                    className="board-toolbar-action"
                >
                    <Settings2 size={16} />
                    Colunas
                </button>
            </div>

            <label className="board-toolbar-search">
                <Search size={16} />

                <input
                    type="search"
                    placeholder={`Pesquisar ${board.item_label_plural.toLowerCase()}`}
                    aria-label={`Pesquisar ${board.item_label_plural.toLowerCase()}`}
                />
            </label>
        </div>
    )
}