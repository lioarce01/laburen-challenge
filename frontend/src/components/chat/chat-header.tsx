"use client"

import { ShoppingBag } from "lucide-react"
import { ThemeToggle } from "../theme/theme-toggle"

interface ChatHeaderProps {
  isDark: boolean
  onThemeToggle: () => void
}

export function ChatHeader({ isDark, onThemeToggle }: ChatHeaderProps) {
  return (
    <div className="text-center mb-6 pt-8">
      <div className="flex justify-center items-center mb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg">
          <ShoppingBag className="w-8 h-8 text-white" />
        </div>
        <div className="ml-4">
          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
        </div>
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
        Shopping Assistant
      </h1>
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        Hi there! I'm here to help you find and buy amazing products ✨
      </p>
    </div>
  )
}
