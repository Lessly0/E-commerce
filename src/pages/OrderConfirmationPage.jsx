import { useParams, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
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
    <Card className="mx-auto max-w-md text-center">
      <h1 className="text-xl font-bold text-gray-900">Thanks for your order!</h1>
      <p className="mt-1 text-sm text-gray-500">Order #{order.id}</p>
      <p className="mt-4 font-semibold text-brand-700">Total: ${order.total?.toFixed(2)}</p>
      <Link to="/orders" className="mt-6 inline-block text-sm text-brand-700 underline">
        View order history
      </Link>
    </Card>
  )
}
