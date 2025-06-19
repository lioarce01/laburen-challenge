import type { Message as MessageType } from "../hooks/use-chat"

interface MessageProps {
  message: MessageType
  isDark: boolean
}

export function Message({ message, isDark }: MessageProps) {
  return (
    <div className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-end space-x-2 max-w-[85%] ${message.from === "user" ? "flex-row-reverse space-x-reverse" : ""
          }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${message.from === "user"
              ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white"
              : "bg-gradient-to-r from-purple-400 to-blue-400 text-white"
            }`}
        >
          {message.from === "user" ? "You" : "AI"}
        </div>

        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap ${message.from === "user"
              ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-br-md"
              : isDark
                ? "bg-gray-900 text-gray-100 border border-gray-800 rounded-bl-md"
                : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
            }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  )
}
