import { useCallback, useState } from 'react'
import { getWorkspaces, createWorkspace, } from '../services/workspaceService'

export const useWorkspaces = () => {
    const [workspaces, setWorkspaces] = useState([])
    const [loading, setLoading] = useState(false)
    const [creating, setCreating] = useState(false)

    const handleLoadWorkspaces = useCallback(async () => {
        setLoading(true)

        try {
            const data = await getWorkspaces()

            setWorkspaces(data)
        } catch (err) {
            console.error('Erro ao carregar workspaces:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreateWorkspace = async (name) => {
        if (!name.trim()) {
            return
        }

        setCreating(true)

        try {
            const workspace = await createWorkspace({ name: name.trim() })

            setWorkspaces((current) => [...current, workspace])
        } catch (err) {
            console.error('Erro ao criar workspace:', err)
        } finally {
            setCreating(false)
        }
    }

    return {
        workspaces,
        loading,
        creating,
        handleLoadWorkspaces,
        handleCreateWorkspace,
    }
}
