import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useCart } from '../features/cart/useCart'
import { usePlaceOrder } from '../features/orders/useOrderMutations'
import { useToast } from '../context/ToastContext'

export default function CheckoutPage() {
  const { data: cart } = useCart()
  const placeOrder = usePlaceOrder()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', address: '', city: '', zip: '', email: '' })
  const [errors, setErrors] = useState({})

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Required'
    if (!form.email.trim()) next.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Invalid email'
    if (!form.address.trim()) next.address = 'Required'
    if (!form.city.trim()) next.city = 'Required'
    if (!form.zip.trim()) next.zip = 'Required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    placeOrder.mutate(
      { shippingAddress: form, cartId: cart?.id },
      {
        onSuccess: (order) => {
          showToast('Order placed!')
          navigate(`/orders/${order.id}`)
        },
        onError: (err) => showToast(err.message || 'Checkout failed, please try again', 'error'),
      }
    )
  }

  const items = cart?.items ?? []
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Contact information</h2>
            <Input id="email" label="Email address" type="email" value={form.email} onChange={handleChange('email')} error={errors.email} />
            <Input id="name" label="Full name" value={form.name} onChange={handleChange('name')} error={errors.name} />
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Shipping address</h2>
            <Input id="address" label="Street address" value={form.address} onChange={handleChange('address')} error={errors.address} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="city" label="City" value={form.city} onChange={handleChange('city')} error={errors.city} />
              <Input id="zip" label="ZIP code" value={form.zip} onChange={handleChange('zip')} error={errors.zip} />
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
            <p className="text-sm text-gray-500">
              Payment is processed securely. (Demo checkout — no real charge.)
            </p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              💳 Card ending in 4242 (demo)
            </div>
          </Card>

          <div className="flex gap-3">
            <Link to="/cart">
              <Button variant="secondary" type="button">Back to cart</Button>
            </Link>
            <Button type="submit" size="lg" className="flex-1" loading={placeOrder.isPending}>
              {placeOrder.isPending ? 'Placing order…' : `Place order · $${total.toFixed(2)}`}
            </Button>
          </div>
        </form>

        <Card className="h-fit space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-12 w-12 rounded-lg bg-gray-100 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                </div>
                <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-gray-200 pt-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
