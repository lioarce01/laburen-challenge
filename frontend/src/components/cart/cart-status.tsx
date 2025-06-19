import { ShoppingBag, CheckCircle } from "lucide-react"

interface CartStatusProps {
  cartId: number | null
  isDark: boolean
}

export function CartStatus({ cartId, isDark }: CartStatusProps) {
  if (!cartId) return null

  return (
    <div className="mt-4 flex justify-center animate-in slide-in-from-bottom-2 duration-500">
      <div
        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${isDark
            ? "bg-emerald-900/50 text-emerald-300 border border-emerald-800/50 shadow-emerald-900/25"
            : "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-emerald-500/10"
          } backdrop-blur-sm`}
      >
        <div className="relative mr-2">
          <ShoppingBag className="w-4 h-4" />
          <CheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-emerald-500 animate-pulse" />
        </div>
        <span>Cart Active</span>
        <span
          className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${isDark ? "bg-emerald-800 text-emerald-200" : "bg-emerald-200 text-emerald-800"
            }`}
        >
          ID: {cartId}
        </span>
      </div>
    </div>
  )
}
