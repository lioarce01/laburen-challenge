"use client"

import { useLocalStorage } from "./use-local-storage"

export function useTheme() {
  const [isDark, setIsDark] = useLocalStorage("chat-theme", false)

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return { isDark, toggleTheme }
}
