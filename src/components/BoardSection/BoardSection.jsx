import { useEffect, useRef, useState } from 'react'
import { useDroppable } from '@dnd-kit/react'
import { CollisionPriority } from '@dnd-kit/abstract'
import { SortableBoardItem } from '../SortableBoardItem/SortableBoardItem'
import { ChevronDown, ChevronRight, Ellipsis, Plus } from 'lucide-react'
import { AddItemRow } from '../AddItemRow/AddItemRow'
import './BoardSection.css'

export const BoardSection = ({
    section,
    index,
    columns,
    users,
    board,
    gridTemplateColumns,
    onItemTitleCommit,
    onItemOpen,
    onCellCommit,
    onCreateItem,
    onDeleteItem,
    addItemOpen,
    onOpenAddItem,
    onCloseAddItem,
    selectedItemIds,
    onToggleItemSelection,
    onToggleSectionSelection
}) => {
    const [collapsed, setCollapsed] = useState(false)

    const sectionSelectRef = useRef(null)
    const { ref, isDropTarget } = useDroppable({
        id: section.id,
        index,
        type: 'section',
        accept: ['item'],
        group: section.id,
        collisionPriority: CollisionPriority.Low
    })

    const items = [...section.items].filter((item) => !item.deleted_at).sort((a, b) => a.order - b.order)
    const sectionItemIds = items.filter((item) => !item.deleted_at).map((item) => item.id)
    const selectedSectionItemIds = sectionItemIds.filter((itemId) => selectedItemIds.includes(itemId))
    const allSectionItemsSelected = sectionItemIds.length > 0 && selectedSectionItemIds.length === sectionItemIds.length
    const someSectionItemsSelected = selectedSectionItemIds.length > 0 && !allSectionItemsSelected

    useEffect(() => {
        if (sectionSelectRef.current) {
            sectionSelectRef.current.indeterminate = someSectionItemsSelected
        }
    }, [someSectionItemsSelected])

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

        return items.map((item, index) => (
            <SortableBoardItem
                key={item.id}
                item={item}
                section={section}
                index={index}
                gridTemplateColumns={gridTemplateColumns}
                columns={columns}
                users={users}
                selectedItemIds={selectedItemIds}
                onToggleItemSelection={onToggleItemSelection}
                onItemTitleCommit={onItemTitleCommit}
                onItemOpen={onItemOpen}
                onCellCommit={onCellCommit}
                onDeleteItem={onDeleteItem}
            />
        ))
    }

    return (
        <section
            className={`board-section ${isDropTarget ? 'is-drop-target' : ''}`}
            ref={ref}
        >
            <header className="board-section-header">
                <div className="board-section-selection">
                    <input
                        ref={sectionSelectRef}
                        type="checkbox"
                        checked={allSectionItemsSelected}
                        disabled={sectionItemIds.length === 0}
                        onChange={() => onToggleSectionSelection(sectionItemIds)}
                        aria-label={`Selecionar itens da seção ${section.name}`}
                    />
                </div>
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