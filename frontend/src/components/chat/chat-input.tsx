"use client"

import { Send, Sparkles } from "lucide-react"
import { CartStatus } from "../cart/cart-status"

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  loading: boolean
  cartId: number | null
  isDark: boolean
  onSendMessage: () => void
}

export function ChatInput({ input, setInput, loading, cartId, isDark, onSendMessage }: ChatInputProps) {
  return (
    <div
      className={`p-6 border-t transition-all duration-500 backdrop-blur-sm ${isDark ? "bg-slate-900/50 border-slate-700/50" : "bg-white/80 border-gray-200/50"
        }`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!loading) onSendMessage()
        }}
        className="flex items-center space-x-4"
      >
        <div className="flex-1 relative group">
          <input
            type="text"
            className={`w-full rounded-2xl border-2 px-6 py-4 pr-12 focus:outline-none focus:ring-4 transition-all duration-300 text-base font-medium placeholder:font-normal ${isDark
                ? "bg-slate-800/80 border-slate-700 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/20 focus:bg-slate-800"
                : "bg-white/90 border-gray-200 text-slate-900 placeholder-slate-500 focus:border-purple-400 focus:ring-purple-400/20 focus:bg-white"
              } group-hover:shadow-lg backdrop-blur-sm`}
            placeholder="What can I help you find today? 🛍️"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />

          {/* Input decoration */}
          {!input && (
            <Sparkles
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? "text-slate-500" : "text-slate-400"
                } animate-pulse`}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95 disabled:scale-100 ${loading || !input.trim()
              ? "bg-gradient-to-br from-gray-300 to-gray-400 cursor-not-allowed shadow-none"
              : "bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-700 shadow-purple-500/25 hover:shadow-purple-500/40"
            } text-white group overflow-hidden`}
        >
          <div className="relative z-10">
            <Send
              className={`w-5 h-5 transition-transform duration-300 ${loading ? "animate-pulse" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                }`}
            />
          </div>

          {/* Button shine effect */}
          {!loading && input.trim() && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          )}
        </button>
      </form>

      <CartStatus cartId={cartId} isDark={isDark} />
    </div>
  )
}
