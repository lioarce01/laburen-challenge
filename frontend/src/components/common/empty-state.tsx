import { Sparkles, ShoppingBag, Heart } from "lucide-react"

interface EmptyStateProps {
  isDark: boolean
}

export function EmptyState({ isDark }: EmptyStateProps) {
  return (
    <div className="text-center py-12 animate-in fade-in-50 duration-1000">
      <div className="relative mb-8">
        <div
          className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${isDark ? "bg-gradient-to-br from-purple-600 to-pink-600" : "bg-gradient-to-br from-purple-500 to-pink-500"
            } shadow-2xl shadow-purple-500/25 animate-pulse`}
        >
          <ShoppingBag className="w-12 h-12 text-white" />
        </div>

        <Heart
          className={`absolute -bottom-1 -left-2 w-5 h-5 ${isDark ? "text-pink-400" : "text-pink-500"} animate-pulse`}
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="space-y-4">
        <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
          Welcome to your Shopping Assistant! 🛍️
        </h3>

        <p className={`text-lg ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          I&apos;m here to help you discover amazing products
        </p>

        <div
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${isDark
            ? "bg-purple-900/50 text-purple-300 border border-purple-800"
            : "bg-purple-100 text-purple-700 border border-purple-200"
            }`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Ask me anything about products, prices, or your cart!
        </div>
      </div>
    </div>
  )
}
