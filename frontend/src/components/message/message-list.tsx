import type React from "react"
import { EmptyState } from "../common/empty-state"
import { LoadingIndicator } from "../common/loading-indicator"
import type { Message as MessageType } from "../../hooks/use-chat"
import { Message } from "./message"

interface MessageListProps {
  messages: MessageType[]
  loading: boolean
  isDark: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export function MessageList({ messages, loading, isDark, messagesEndRef }: MessageListProps) {
  return (
    <div
      className={`h-[500px] overflow-y-auto p-8 space-y-6 transition-all duration-500 ease-in-out scroll-smooth ${isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"
          : "bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/50"
        } backdrop-blur-sm`}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: isDark ? "#6366f1 #1e293b" : "#a855f7 #f1f5f9",
      }}
    >
      {messages.length === 0 && <EmptyState isDark={isDark} />}

      {messages.map((message, idx) => (
        <div
          key={idx}
          className="animate-in slide-in-from-bottom-4 duration-500 ease-out"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <Message message={message} isDark={isDark} />
        </div>
      ))}

      {loading && <LoadingIndicator isDark={isDark} />}

      <div ref={messagesEndRef} />
    </div>
  )
}
