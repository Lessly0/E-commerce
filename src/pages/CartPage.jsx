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
        Couldn't load your cart: {error.message}
      </div>
    )
  }

  if (!cart.items?.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Your cart is empty. <Link to="/" className="text-brand-700 underline">Browse products</Link>
      </div>
    )
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="space-y-3 sm:col-span-2">
        {cart.items.map((item) => (
          <Card key={item.id} className="flex items-center gap-4">
            <img src={item.image} alt={item.title} className="h-16 w-16 rounded-lg object-cover bg-gray-100" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-500">${item.price?.toFixed(2)} each</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              aria-label={`Quantity for ${item.title}`}
              onChange={(e) =>
                updateItem.mutate({ itemId: item.id, quantity: Number(e.target.value) })
              }
              className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center text-sm"
            />
            <Button
              variant="ghost"
              onClick={() =>
                removeItem.mutate(item.id, {
                  onSuccess: () => showToast('Item removed'),
                  onError: (err) => showToast(err.message, 'error'),
                })
              }
            >
              Remove
            </Button>
          </Card>
        ))}
      </div>

      <Card className="h-fit">
        <h2 className="mb-3 font-semibold text-gray-900">Order summary</h2>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <Button className="mt-4 w-full" onClick={() => navigate('/checkout')}>
          Checkout
        </Button>
      </Card>
    </div>
  )
}
