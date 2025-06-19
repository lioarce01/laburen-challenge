interface LoadingIndicatorProps {
  isDark: boolean
}

export function LoadingIndicator({ isDark }: LoadingIndicatorProps) {
  return (
    <div className="flex justify-start animate-in slide-in-from-left-4 duration-500">
      <div className="flex items-end space-x-3 max-w-[80%]">

        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-white/20 animate-pulse">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </div>

        <div
          className={`relative px-6 py-4 rounded-3xl rounded-bl-lg shadow-lg backdrop-blur-sm ${isDark
            ? "bg-slate-800/80 text-slate-100 border border-slate-700/50 shadow-slate-900/50"
            : "bg-white/90 text-slate-800 border border-white/50 shadow-purple-500/10"
            }`}
        >
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: "1s",
                  }}
                />
              ))}
            </div>
            <span className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>Thinking...</span>
          </div>

          <div
            className={`absolute -bottom-1 -left-1 w-3 h-3 rotate-45 ${isDark
              ? "bg-slate-800/80 border-l border-t border-slate-700/50"
              : "bg-white/90 border-l border-t border-white/50"
              }`}
          />
        </div>
      </div>
    </div>
  )
}
