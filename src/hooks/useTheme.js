import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage('truthlens-theme', 'dark')

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const setDark = () => setTheme('dark')
  const setLight = () => setTheme('light')

  return { theme, toggleTheme, setDark, setLight, isDark: theme === 'dark' }
}