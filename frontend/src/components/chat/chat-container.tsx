import type React from "react"
import { MessageList } from "../message/message-list"
import { ChatInput } from "./chat-input"
import type { Message } from "../../hooks/use-chat"

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
      className={`rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 backdrop-blur-xl ${isDark
        ? "bg-slate-900/90 border border-slate-700/50 shadow-slate-900/50"
        : "bg-white/95 border border-white/50 shadow-purple-500/10"
        } hover:shadow-3xl transform hover:scale-[1.01]`}
    >
      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />

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
