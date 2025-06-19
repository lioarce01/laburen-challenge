import type React from "react"
import { MessageList } from "./message-list"
import { ChatInput } from "./chat-input"
import type { Message } from "../hooks/use-chat"

interface ChatContainerProps {
  messages: Message[]
  input: string
  setInput: (value: string) => void
  loading: boolean
  cartId: number | null
  isDark: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  onSendMessage: () => void
}

export function ChatContainer({
  messages,
  input,
  setInput,
  loading,
  cartId,
  isDark,
  messagesEndRef,
  onSendMessage,
}: ChatContainerProps) {
  return (
    <div
      className={`rounded-3xl shadow-xl overflow-hidden transition-colors duration-300 ${isDark ? "bg-gray-950 border border-gray-800" : "bg-white"
        }`}
    >
      <MessageList messages={messages} loading={loading} isDark={isDark} messagesEndRef={messagesEndRef} />
      <ChatInput
        input={input}
        setInput={setInput}
        loading={loading}
        cartId={cartId}
        isDark={isDark}
        onSendMessage={onSendMessage}
      />
    </div>
  )
}
