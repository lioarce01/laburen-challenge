"use client"

import { ShoppingBag, Sparkles } from "lucide-react"
import { ThemeToggle } from "../theme/theme-toggle"

interface ChatHeaderProps {
  isDark: boolean
  onThemeToggle: () => void
}

export function ChatHeader({ isDark, onThemeToggle }: ChatHeaderProps) {
  return (
    <div className="text-center mb-8 pt-8 animate-in fade-in-50 slide-in-from-top-4 duration-1000">
      <div className="flex justify-center items-center mb-6 relative">
        {/* Main logo */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 rounded-3xl shadow-2xl shadow-purple-500/25 flex items-center justify-center transform hover:scale-110 transition-all duration-500 hover:rotate-3">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>

          <Sparkles
            className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
          <Sparkles
            className="absolute -bottom-1 -left-2 w-4 h-4 text-pink-400 animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="absolute right-0 top-2">
          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
        </div>
      </div>

      <div className="space-y-4">
        <h1
          className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-3 animate-in slide-in-from-bottom-4 duration-1000"
          style={{ animationDelay: "0.2s" }}
        >
          Shopping Assistant
        </h1>

        <div
          className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isDark
            ? "bg-slate-800/50 text-slate-300 border border-slate-700"
            : "bg-purple-50 text-purple-700 border border-purple-200"
            } animate-in slide-in-from-bottom-4 duration-1000`}
          style={{ animationDelay: "0.4s" }}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Your personal shopping companion - here to help you find amazing products! ✨
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute top-10 left-10 w-32 h-32 rounded-full ${isDark ? "bg-purple-900/20" : "bg-purple-200/30"
            } blur-3xl animate-pulse`}
        />
        <div
          className={`absolute top-20 right-16 w-24 h-24 rounded-full ${isDark ? "bg-pink-900/20" : "bg-pink-200/30"
            } blur-2xl animate-pulse`}
          style={{ animationDelay: "1s" }}
        />
      </div>
    </div>
  )
}
