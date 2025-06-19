"use client"
import { ChatContainer } from "../components/chat/chat-container"
import { useTheme } from "../hooks/use-theme"
import { useChat } from "../hooks/use-chat"
import { ChatHeader } from "@/components/chat/chat-header"

export default function Chat() {
  const { isDark, toggleTheme } = useTheme()
  const { messages, input, setInput, cartId, loading, messagesEndRef, sendMessage } = useChat()

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-700 ${isDark
        ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
        : "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
        }`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? "bg-purple-600" : "bg-purple-300"
            }`}
          style={{ animationDuration: "4s" }}
        />
        <div
          className={`absolute top-40 right-20 w-96 h-96 rounded-full blur-3xl opacity-15 animate-pulse ${isDark ? "bg-pink-600" : "bg-pink-300"
            }`}
          style={{ animationDuration: "6s", animationDelay: "2s" }}
        />
        <div
          className={`absolute bottom-20 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-10 animate-pulse ${isDark ? "bg-indigo-600" : "bg-indigo-300"
            }`}
          style={{ animationDuration: "5s", animationDelay: "1s" }}
        />

        <div
          className={`absolute inset-0 ${isDark
            ? "bg-gradient-to-tr from-purple-900/10 via-transparent to-pink-900/10"
            : "bg-gradient-to-tr from-purple-100/30 via-transparent to-pink-100/30"
            }`}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-in fade-in-50 slide-in-from-top-8 duration-1000">
              <ChatHeader isDark={isDark} onThemeToggle={toggleTheme} />
            </div>

            <div
              className="animate-in fade-in-50 slide-in-from-bottom-8 duration-1000"
              style={{ animationDelay: "0.3s" }}
            >
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
            </div>
          </div>
        </div>

        <footer
          className={`relative z-10 py-8 px-4 transition-all duration-500 animate-in fade-in-50 slide-in-from-bottom-4`}
          style={{ animationDelay: "0.6s" }}
        >
          <div className="max-w-4xl mx-auto">
            <div
              className={`w-24 h-px mx-auto mb-4 ${isDark
                ? "bg-gradient-to-r from-transparent via-slate-600 to-transparent"
                : "bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                }`}
            />

            <div className="text-center space-y-2">
              <p
                className={`text-sm font-medium transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-500"
                  }`}
              >
                <span className="inline-flex items-center">
                  Powered by AI
                  <svg className="w-4 h-4 mx-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Here to make your shopping experience amazing
                </span>
              </p>

              <div
                className={`flex items-center justify-center space-x-4 text-xs ${isDark ? "text-slate-500" : "text-slate-400"
                  }`}
              >
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  Online & Ready
                </span>
                <span>•</span>
                <span>24/7 Shopping Support</span>
                <span>•</span>
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure
                </span>
              </div>
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full ${isDark ? "bg-slate-600" : "bg-slate-300"} animate-pulse`}
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </div>
          </div>
        </footer>
      </div>

      <div
        className={`absolute inset-0 opacity-[0.02] pointer-events-none ${isDark ? "bg-white" : "bg-slate-900"}`}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  )
}
