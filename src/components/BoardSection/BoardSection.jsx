import { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight, Ellipsis, Plus } from 'lucide-react'
import { BoardCell } from '../BoardCell/BoardCell'
import { BoardItemTitle } from '../BoardItemTitle/BoardItemTitle'
import { AddItemRow } from '../AddItemRow/AddItemRow'
import './BoardSection.css'

export const BoardSection = ({ section, columns, users, board, gridTemplateColumns, onItemTitleCommit, onItemOpen, onCellCommit, onCreateItem, addItemOpen, onOpenAddItem, onCloseAddItem }) => {
    const [collapsed, setCollapsed] = useState(false)

    const items = [...section.items]
        .filter((item) => !item.deleted_at)
        .sort((a, b) => a.order - b.order)

    useEffect(() => {
        if (addItemOpen) {
            setCollapsed(false)
        }
    }, [addItemOpen])

    const renderItems = () => {
        if (items.length === 0) {
            return (
                <div className="board-section-empty">
                    Não há {board.item_label_singular.toLowerCase()} nesta seção.
                </div>
            )
        }

        return items.map((item) => (
            <div
                key={item.id}
                className="board-item-row"
                style={{ gridTemplateColumns }}
            >
                <button
                    type="button"
                    className="board-item-more"
                    aria-label={`Mais opções de ${item.title}`}
                >
                    <Ellipsis size={16} />
                </button>

                <BoardItemTitle
                    item={item}
                    onCommit={onItemTitleCommit}
                    onOpen={onItemOpen}
                />

                {columns.map((column) => (
                    <BoardCell
                        key={column.id}
                        column={column}
                        item={item}
                        users={users}
                        onCommit={onCellCommit}
                    />
                ))}
            </div>
        ))
    }

    return (
        <section className="board-section">
            <header className="board-section-header">
                <button
                    type="button"
                    className="board-section-toggle"
                    onClick={() => setCollapsed((current) => !current)}
                    aria-label={collapsed ? 'Expandir seção' : 'Recolher seção'}
                >
                    {collapsed
                        ? <ChevronRight size={17} />
                        : <ChevronDown size={17} />
                    }
                </button>

                <div className="board-section-title">
                    <span>{section.name}</span>

                    <span className="board-section-count">
                        {items.length}
                    </span>
                </div>

                <button
                    type="button"
                    className="board-section-add"
                    title={`Adicionar ${board.item_label_singular.toLowerCase()}`}
                    onClick={() => onOpenAddItem(section.id)}
                >
                    <Plus size={15} />
                </button>

                <button
                    type="button"
                    className="board-section-more"
                    title="Mais opções"
                >
                    <Ellipsis size={17} />
                </button>
            </header>

            {!collapsed && (
                <div className="board-section-items">
                    {renderItems()}

                    <AddItemRow
                        open={addItemOpen}
                        onOpen={() => onOpenAddItem(section.id)}
                        onClose={onCloseAddItem}
                        onCreate={(title) => onCreateItem({
                            sectionId: section.id,
                            title
                        })}
                    />
                </div>
            )}
        </section>
    )
}