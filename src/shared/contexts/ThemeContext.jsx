import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

/**
 * [ThemeContext.jsx]
 * 테마(다크모드/라이트모드)를 수동으로 전환하고 기억하는 바구니입니다.
 */

export function ThemeProvider({ children }) {
  // 1. 초기값 설정: 이전에 선택한 테마가 있으면 가져오고, 없으면 시스템 설정을 따릅니다.
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // 2. 테마가 바뀔 때마다 <html> 태그에 'dark' 클래스를 넣다 뺐다 합니다.
  // 테일윈드는 이 클래스를 보고 색상을 결정합니다.
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
