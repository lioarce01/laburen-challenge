import type React from "react"
import { Message } from "./message"
import { EmptyState } from "./empty-state"
import { LoadingIndicator } from "./loading-indicator"
import type { Message as MessageType } from "../hooks/use-chat"

interface MessageListProps {
  messages: MessageType[]
  loading: boolean
  isDark: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export function MessageList({ messages, loading, isDark, messagesEndRef }: MessageListProps) {
  return (
    <div
      className={`h-[500px] overflow-y-auto p-6 space-y-4 transition-colors duration-300 ${isDark ? "bg-gradient-to-b from-black to-gray-950" : "bg-gradient-to-b from-white to-gray-50"
        }`}
    >
      {messages.length === 0 && <EmptyState isDark={isDark} />}

      {messages.map((message, idx) => (
        <Message key={idx} message={message} isDark={isDark} />
      ))}

      {loading && <LoadingIndicator isDark={isDark} />}

      <div ref={messagesEndRef} />
    </div>
  )
}
