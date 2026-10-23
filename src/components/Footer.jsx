import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">E</span>
            <span className="text-lg font-bold text-gray-900">E‑Comus.</span>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Your destination for everyday shopping. Quality products, fast shipping, easy returns.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-brand-600">All products</Link></li>
            <li><Link to="/cart" className="hover:text-brand-600">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li><Link to="/orders" className="hover:text-brand-600">Order history</Link></li>
            <li><Link to="/checkout" className="hover:text-brand-600">Checkout</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-brand-600">Help center</a></li>
            <li><a href="#" className="hover:text-brand-600">Shipping & returns</a></li>
            <li><a href="#" className="hover:text-brand-600">Contact us</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} E-Comus. All rights reserved.
      </div>
    </footer>
  )
}
