import { useParams, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import { useOrder } from '../features/orders/useOrders'

export default function OrderConfirmationPage() {
  const { id } = useParams()
  const { data: order, isLoading, isError } = useOrder(id)

  if (isLoading) return <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>

  if (isError || !order) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        We couldn't find that order.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card className="text-center p-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Thanks for your order!</h1>
        <p className="mt-1 text-sm text-gray-500">Order #{order.id}</p>
        <p className="mt-4 text-lg font-semibold text-brand-700">Total: ${order.total?.toFixed(2)}</p>
        <p className="mt-2 text-sm text-gray-500">
          We've sent a confirmation to your email. You can track your order in your order history.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/orders">
            <Button variant="secondary">View order history</Button>
          </Link>
          <Link to="/">
            <Button>Continue shopping</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
