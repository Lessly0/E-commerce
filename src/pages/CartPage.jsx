import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import { useCart } from '../features/cart/useCart'
import { useUpdateCartItem, useRemoveCartItem } from '../features/cart/useCartMutations'
import { useToast } from '../context/ToastContext'

export default function CartPage() {
  const { data: cart, isLoading, isError, error } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const { showToast } = useToast()
  const navigate = useNavigate()

  if (isLoading) return <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Couldn't load your cart: {error?.message}
      </div>
    )
  }

  if (!cart?.items?.length) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl">🛒</div>
        <h2 className="text-lg font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-1 text-sm text-gray-500">Looks like you haven't added anything yet.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Browse products</Button>
        </Link>
      </div>
    )
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Shopping cart</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.items.map((item) => (
            <Card key={item.id} className="flex items-center gap-4 p-4">
              <img
                src={item.image}
                alt={item.title}
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80?text=No+Image' }}
                className="h-20 w-20 shrink-0 rounded-lg bg-gray-100 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-sm text-gray-500">${item.price?.toFixed(2)} each</p>
              </div>
              <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                <button
                  onClick={() => updateItem.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                  className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-50"
                  aria-label="Decrease"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  aria-label={`Quantity for ${item.title}`}
                  onChange={(e) =>
                    updateItem.mutate({ itemId: item.id, quantity: Math.max(1, Number(e.target.value) || 1) })
                  }
                  className="w-12 border-x border-gray-300 py-1.5 text-center text-sm focus:outline-none"
                />
                <button
                  onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                  className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-50"
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
              <p className="w-20 text-right font-semibold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  removeItem.mutate(item.id, {
                    onSuccess: () => showToast('Item removed'),
                    onError: (err) => showToast(err.message, 'error'),
                  })
                }
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </Button>
            </Card>
          ))}
        </div>

        <Card className="h-fit space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          {subtotal < 50 && (
            <p className="text-xs text-gray-500">Add ${(50 - subtotal).toFixed(2)} more for free shipping.</p>
          )}
          <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
            Checkout
          </Button>
          <Link to="/" className="block text-center text-sm text-brand-700 hover:underline">
            Continue shopping
          </Link>
        </Card>
      </div>
    </div>
  )
}

