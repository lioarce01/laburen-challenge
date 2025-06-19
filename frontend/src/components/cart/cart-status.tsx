import { ShoppingBag } from "lucide-react"

interface CartStatusProps {
  cartId: number | null
  isDark: boolean
}

export function CartStatus({ cartId, isDark }: CartStatusProps) {
  if (!cartId) return null

  return (
    <div className="mt-3 text-center">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isDark ? "bg-green-950 text-green-400 border border-green-900" : "bg-green-100 text-green-800"
          }`}
      >
        <ShoppingBag className="w-3 h-3 mr-1" />
        Cart Active (ID: {cartId})
      </span>
    </div>
  )
}
