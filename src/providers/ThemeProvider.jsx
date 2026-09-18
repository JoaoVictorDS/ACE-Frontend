import { useEffect, useMemo } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'
import { useUser } from '../hooks/useUser'

export const ThemeProvider = ({ children }) => {
    const { data: user } = useUser()

    const theme = user?.preferences?.theme || 'LIGHT'

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme === 'DARK' ? 'dark' : 'light')
    }, [theme])

    return (
        <ThemeContext.Provider value={{
            theme,
            isDark: theme === 'DARK',
            isLight: theme !== 'DARK',
        }}>{children}</ThemeContext.Provider>
    )
}
