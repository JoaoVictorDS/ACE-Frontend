import { ArrowUpDown, Filter, Plus, Search, Settings2 } from 'lucide-react'
import { Button } from '../Button/Button'
import './BoardToolbar.css'

export const BoardToolbar = ({ board }) => {
    return (
        <div className="board-toolbar">
            <div className="board-toolbar-left">
                <Button variant="primary" type="button">
                    <Plus size={16} />
                    Novo {board.item_label_singular}
                </Button>

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