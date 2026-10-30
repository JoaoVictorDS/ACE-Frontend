
import { useEffect, useRef, useState } from 'react'
import { useSortable } from '@dnd-kit/react/sortable'
import { CollisionPriority } from '@dnd-kit/abstract'
import { SortableBoardItem } from '../SortableBoardItem/SortableBoardItem'
import { ChevronDown, ChevronRight, Ellipsis, GripVertical, Plus, Trash2 } from 'lucide-react'
import { AddItemRow } from '../AddItemRow/AddItemRow'
import './BoardSection.css'

export const BoardSection = ({
    section,
    index,
    columns,
    users,
    board,
    canMoveBoardStructure,
    gridTemplateColumns,
    onItemTitleCommit,
    onItemOpen,
    onCellCommit,
    onCreateItem,
    onDeleteItem,
    onSectionNameCommit,
    onDeleteSection,
    addItemOpen,
    onOpenAddItem,
    onCloseAddItem,
    selectedItemIds,
    onToggleItemSelection,
    onToggleSectionSelection
}) => {
    const [collapsed, setCollapsed] = useState(false)
    const [editingName, setEditingName] = useState(false)
    const [sectionName, setSectionName] = useState(section.name ?? '')
    const [savingName, setSavingName] = useState(false)
    const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false)

    const sectionSelectRef = useRef(null)
    const sectionNameInputRef = useRef(null)
    const sectionMenuRef = useRef(null)
    const savingNameRef = useRef(false)
    const cancelNameBlurRef = useRef(false)

    const items = [...section.items].filter((item) => !item.deleted_at).sort((a, b) => a.order - b.order)

    const { ref, handleRef, isDropTarget, isDragging } = useSortable({
        id: `section-${section.id}`,
        index,
        type: 'section',
        accept: ['item', 'section'],
        group: 'board-sections',
        collisionPriority: CollisionPriority.Low,
        disabled: {
            draggable: !canMoveBoardStructure
        },
        data: {
            sectionId: section.id,
            itemCount: items.length
        }
    })

    const sectionItemIds = items.map((item) => item.id)
    const selectedSectionItemIds = sectionItemIds.filter((itemId) => selectedItemIds.includes(itemId))
    const allSectionItemsSelected = sectionItemIds.length > 0 && selectedSectionItemIds.length === sectionItemIds.length
    const someSectionItemsSelected = selectedSectionItemIds.length > 0 && !allSectionItemsSelected

    useEffect(() => {
        if (!editingName) {
            setSectionName(section.name ?? '')
        }
    }, [section.name, editingName])

    useEffect(() => {
        if (editingName) {
            sectionNameInputRef.current?.focus()
            sectionNameInputRef.current?.select()
        }
    }, [editingName])

    useEffect(() => {
        if (!isSectionMenuOpen) return

        const handlePointerDown = (event) => {
            if (!sectionMenuRef.current?.contains(event.target)) {
                setIsSectionMenuOpen(false)
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
        }
    }, [isSectionMenuOpen])

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

    const handleStartNameEdit = () => {
        if (savingNameRef.current) return

        setSectionName(section.name ?? '')
        cancelNameBlurRef.current = false
        setEditingName(true)
    }

    const handleCancelNameEdit = () => {
        if (savingNameRef.current) return

        cancelNameBlurRef.current = true
        setSectionName(section.name ?? '')
        setEditingName(false)
    }

    const handleCommitNameEdit = async () => {
        if (savingNameRef.current) return

        const nextName = sectionName.trim()

        if (!nextName || nextName === section.name) {
            setSectionName(section.name ?? '')
            setEditingName(false)
            return
        }

        savingNameRef.current = true
        setSavingName(true)

        try {
            await onSectionNameCommit({
                section,
                name: nextName
            })

            setEditingName(false)
        } catch {
            // Mantém a edição aberta caso a atualização falhe.
        } finally {
            savingNameRef.current = false
            setSavingName(false)
        }
    }

    const handleNameKeyDown = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            await handleCommitNameEdit()
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            handleCancelNameEdit()
        }
    }

    const handleNameBlur = () => {
        if (cancelNameBlurRef.current) {
            cancelNameBlurRef.current = false
            return
        }

        if (!savingNameRef.current) {
            handleCommitNameEdit()
        }
    }

    const handleDeleteSection = () => {
        setIsSectionMenuOpen(false)

        onDeleteSection(section)
    }

    const renderItems = () => {
        if (items.length === 0) {
            return (
                <div className="board-section-empty">
                    Não há {board.item_label_singular.toLowerCase()} nesta seção.
                </div>
            )
        }

        return items.map((item, itemIndex) => (
            <SortableBoardItem
                key={item.id}
                item={item}
                section={section}
                index={itemIndex}
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
            ref={ref}
            className={[
                'board-section',
                isDropTarget && 'is-drop-target',
                isDragging && 'is-dragging'
            ].filter(Boolean).join(' ')}
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

                {canMoveBoardStructure && (
                    <button
                        ref={handleRef}
                        type="button"
                        className="board-section-drag-handle"
                        title="Arrastar para reordenar"
                        aria-label={`Mover seção ${section.name}`}
                    >
                        <GripVertical size={16} />
                    </button>
                )}

                <div className="board-section-title">
                    {editingName ? (
                        <input
                            ref={sectionNameInputRef}
                            type="text"
                            className="board-section-title-input"
                            value={sectionName}
                            disabled={savingName}
                            onChange={(event) => setSectionName(event.target.value)}
                            onKeyDown={handleNameKeyDown}
                            onBlur={handleNameBlur}
                            aria-label={`Editar nome da seção ${section.name}`}
                        />
                    ) : (
                        <button
                            type="button"
                            className="board-section-name-edit"
                            onClick={handleStartNameEdit}
                        >
                            <span
                                className="board-section-name"
                                title={section.name}
                            >
                                {section.name}
                            </span>
                        </button>
                    )}

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

                <div
                    ref={sectionMenuRef}
                    className="board-section-edit-menu"
                >
                    <button
                        type="button"
                        className="board-section-more"
                        title="Mais opções"
                        aria-label={`Mais opções para a seção ${section.name}`}
                        aria-expanded={isSectionMenuOpen}
                        onClick={() => setIsSectionMenuOpen((current) => !current)}
                    >
                        <Ellipsis size={17} />
                    </button>

                    {isSectionMenuOpen && (
                        <div className="board-section-edit-menu-dropdown">
                            <button
                                type="button"
                                className="board-section-edit-menu-option board-section-edit-menu-option-danger"
                                onClick={handleDeleteSection}
                            >
                                <Trash2 size={14} />
                                Excluir seção
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {!collapsed && (
                <div className="board-section-items">

                    {renderItems()}

                    <div className="board-section-add-item-row">
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
                </div>
            )}
        </section>
    )
}
