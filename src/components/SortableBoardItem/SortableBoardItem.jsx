import { useSortable } from '@dnd-kit/react/sortable'
import { BoardCell } from '../BoardCell/BoardCell'
import { BoardItemTitle } from '../BoardItemTitle/BoardItemTitle'
import { BoardItemMenu } from '../BoardItemMenu/BoardItemMenu'
import './SortableBoardItem.css'

export const SortableBoardItem = ({ item, section, index, gridTemplateColumns, users, columns, selectedItemIds, onToggleItemSelection, onItemTitleCommit, onItemOpen, onCellCommit, onDeleteItem }) => {
    const { ref, isDragging } = useSortable({
        id: item.id,
        index,
        type: 'item',
        accept: ['item'],
        group: section.id
    })

    return (
        <BoardItemMenu
            item={item}
            onDelete={onDeleteItem}
        >
            {({ onContextMenu, menuTrigger }) => (
                <div
                    ref={ref}
                    className={`board-item-row ${isDragging ? 'is-dragging' : ''}`}
                    style={{ gridTemplateColumns }}
                    onContextMenu={onContextMenu}
                >
                    <div className="board-item-selection">
                        <input
                            type="checkbox"
                            checked={selectedItemIds.includes(item.id)}
                            onChange={() => onToggleItemSelection(item.id)}
                            aria-label={`Selecionar ${item.title}`}
                        />
                    </div>

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

                    {menuTrigger}
                </div>
            )}
        </BoardItemMenu>
    )
}