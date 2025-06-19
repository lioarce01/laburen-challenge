import type { Message as MessageType } from "../../hooks/use-chat"

interface MessageProps {
  message: MessageType
  isDark: boolean
}

export function Message({ message, isDark }: MessageProps) {
  return (
    <div className={`flex ${message.from === "user" ? "justify-end" : "justify-start"} group`}>
      <div
        className={`flex items-end space-x-3 max-w-[80%] ${message.from === "user" ? "flex-row-reverse space-x-reverse" : ""
          }`}
      >
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-white/20 transition-all duration-300 group-hover:scale-110 ${message.from === "user"
            ? "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 text-white"
            : "bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 text-white"
            }`}
        >
          {message.from === "user" ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          )}
        </div>

        <div
          className={`relative px-6 py-4 rounded-3xl shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02] ${message.from === "user"
            ? "rounded-br-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/25"
            : isDark
              ? "rounded-bl-lg bg-slate-800/80 text-slate-100 border border-slate-700/50 shadow-slate-900/50"
              : "rounded-bl-lg bg-white/90 text-slate-800 border border-white/50 shadow-purple-500/10"
            }`}
        >
          <div className="whitespace-pre-wrap leading-relaxed font-medium">{message.text}</div>

          <div
            className={`absolute -bottom-1 ${message.from === "user" ? "-right-1" : "-left-1"} w-3 h-3 rotate-45 ${message.from === "user"
              ? "bg-gradient-to-br from-emerald-500 to-teal-600"
              : isDark
                ? "bg-slate-800/80 border-l border-t border-slate-700/50"
                : "bg-white/90 border-l border-t border-white/50"
              }`}
          />
        </div>
      </div>
    </div>
  )
}
