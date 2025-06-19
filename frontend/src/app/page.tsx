"use client"
import { ChatHeader } from "../components/chat-header"
import { ChatContainer } from "../components/chat-container"
import { useTheme } from "../hooks/use-theme"
import { useChat } from "../hooks/use-chat"

export default function Chat() {
  const { isDark, toggleTheme } = useTheme()
  const { messages, input, setInput, cartId, loading, messagesEndRef, sendMessage } = useChat()

  return (
    <div
      className={`min-h-screen p-4 transition-colors duration-300 ${isDark ? "bg-black" : "bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50"
        }`}
    >
      <div className="max-w-2xl mx-auto">
        <ChatHeader isDark={isDark} onThemeToggle={toggleTheme} />

        <ChatContainer
          messages={messages}
          input={input}
          setInput={setInput}
          loading={loading}
          cartId={cartId}
          isDark={isDark}
          messagesEndRef={messagesEndRef}
          onSendMessage={sendMessage}
        />

        {/* Footer */}
        <div
          className={`text-center mt-6 text-xs transition-colors duration-300 ${isDark ? "text-gray-600" : "text-gray-400"
            }`}
        >
          Powered by AI • Here to make your shopping experience amazing
        </div>
      </div>
    </div>
  )
}
