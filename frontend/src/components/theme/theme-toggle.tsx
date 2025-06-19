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
      className={`relative p-3 rounded-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 ${isDark
        ? "bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-amber-400 border border-slate-700 shadow-lg shadow-slate-900/50"
        : "bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white text-slate-600 border border-gray-200 shadow-lg shadow-purple-500/10"
        } group overflow-hidden`}
    >
      <div className="relative z-10 transition-transform duration-500">
        {isDark ? (
          <Sun className="w-5 h-5 transition-all duration-500 group-hover:rotate-180" />
        ) : (
          <Moon className="w-5 h-5 transition-all duration-500 group-hover:-rotate-12" />
        )}
      </div>

      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDark
          ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
          : "bg-gradient-to-br from-purple-500/10 to-pink-500/10"
          }`}
      />
    </button>
  )
}
