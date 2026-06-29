import { Link } from 'react-router-dom'
import { useCart } from '../features/cart/useCart'

export default function Navbar() {
  const { data: cart } = useCart()
  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-brand-700">
          E‑Comus
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/orders" className="hover:text-brand-700">Orders</Link>
          <Link to="/cart" className="relative hover:text-brand-700">
            Cart
            {itemCount > 0 && (
              <span
                aria-label={`${itemCount} items in cart`}
                className="absolute -right-3 -top-2 rounded-full bg-brand-600 px-1.5 text-xs text-white"
              >
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
}
