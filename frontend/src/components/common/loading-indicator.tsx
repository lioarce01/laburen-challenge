interface LoadingIndicatorProps {
  isDark: boolean
}

export function LoadingIndicator({ isDark }: LoadingIndicatorProps) {
  return (
    <div className="flex justify-start">
      <div className="flex items-end space-x-2 max-w-[85%]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-xs font-bold text-white">
          AI
        </div>
        <div
          className={`px-4 py-3 rounded-2xl rounded-bl-md shadow-sm ${isDark
              ? "bg-gray-900 text-gray-100 border border-gray-800"
              : "bg-white text-gray-800 border border-gray-100"
            }`}
        >
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
