"use client"

import { Send } from "lucide-react"
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
      className={`p-6 border-t transition-colors duration-300 ${isDark ? "bg-black border-gray-800" : "bg-gray-50 border-gray-100"
        }`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!loading) onSendMessage()
        }}
        className="flex items-center space-x-3"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            className={`w-full rounded-full border-2 px-6 py-3 pr-12 focus:outline-none focus:ring-4 transition-all duration-200 ${isDark
              ? "bg-gray-900 border-gray-800 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-950"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-400 focus:ring-purple-100"
              }`}
            placeholder="What can I help you find today?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 disabled:scale-100"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      <CartStatus cartId={cartId} isDark={isDark} />
    </div>
  )
}
