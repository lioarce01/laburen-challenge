import { Sparkles } from "lucide-react"

interface EmptyStateProps {
  isDark: boolean
}

export function EmptyState({ isDark }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Sparkles className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-purple-400" : "text-purple-300"}`} />
      <p className={`text-lg mb-2 ${isDark ? "text-gray-200" : "text-gray-500"}`}>Ready to shop?</p>
      <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        Ask me about products, prices, or anything you need!
      </p>
    </div>
  )
}
