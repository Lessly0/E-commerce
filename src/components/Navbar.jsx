import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../features/cart/useCart'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { data: cart } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)
  useEffect(() => {
    function onClick(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    setAccountOpen(false)
    navigate('/')
  }

  const initials = (user?.name || 'U').trim().charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="hidden bg-gray-900 px-4 py-1.5 text-center text-xs text-white sm:block">
        Free shipping on orders over $50 · Easy returns within 30 days
      </div>

      <nav className="container-page flex items-center gap-4 py-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white font-bold shadow-sm">
            E
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            E‑<span className="text-brand-600">Comus.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex ml-auto">
          <Link to="/" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">Home</Link>
          <Link to="/orders" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">Orders</Link>
          <Link to="/profile" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">Profile</Link>
        </div>

        {isAuthenticated ? (
          <div ref={accountRef} className="relative hidden sm:block">
            <button
              onClick={() => setAccountOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100"
            >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
              {initials}
            </div>
              <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                {user?.name || 'Account'}
              </span>
            </button>
            {accountOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                <Link to="/orders" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My orders</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Sign out</button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden items-center gap-2 sm:flex">
            <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">Sign in</Link>
            <Link to="/register" className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700">Create account</Link>
          </div>
        )}

        <Link
          to="/cart"
          className="relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="hidden sm:inline">Cart</span>
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-semibold text-white">
              {itemCount}
            </span>
          )}
        </Link>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 sm:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white sm:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            <Link onClick={() => setMobileOpen(false)} to="/" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Home</Link>
            <Link onClick={() => setMobileOpen(false)} to="/orders" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Orders</Link>
            <Link onClick={() => setMobileOpen(false)} to="/profile" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Profile</Link>
            {isAuthenticated ? (
              <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100">Sign out</button>
            ) : (
              <>
                <Link onClick={() => setMobileOpen(false)} to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Sign in</Link>
                <Link onClick={() => setMobileOpen(false)} to="/register" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Create account</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
