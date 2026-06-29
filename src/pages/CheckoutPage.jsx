import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

  const [form, setForm] = useState({ name: '', address: '', city: '', zip: '' })
  const [errors, setErrors] = useState({})

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Required'
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

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md">
      <Card className="space-y-4">
        <h1 className="text-lg font-semibold text-gray-900">Shipping details</h1>
        <Input id="name" label="Full name" value={form.name} onChange={handleChange('name')} error={errors.name} />
        <Input id="address" label="Address" value={form.address} onChange={handleChange('address')} error={errors.address} />
        <Input id="city" label="City" value={form.city} onChange={handleChange('city')} error={errors.city} />
        <Input id="zip" label="ZIP code" value={form.zip} onChange={handleChange('zip')} error={errors.zip} />

        <Button type="submit" className="w-full" disabled={placeOrder.isPending}>
          {placeOrder.isPending ? 'Placing order…' : 'Place order'}
        </Button>
      </Card>
    </form>
  )
}
