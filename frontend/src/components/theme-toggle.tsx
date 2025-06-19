"use client"

import { Moon, Sun } from "lucide-react"

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`p-3 rounded-full transition-all duration-300 ${isDark
          ? "bg-black hover:bg-gray-900 text-yellow-400 border border-gray-800"
          : "bg-white hover:bg-gray-50 text-gray-600"
        } shadow-lg hover:shadow-xl`}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
