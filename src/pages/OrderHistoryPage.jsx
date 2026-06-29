import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import { useOrders } from '../features/orders/useOrders'

export default function OrderHistoryPage() {
  const { data: orders, isLoading, isError, error } = useOrders()

  if (isLoading) return <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>

  if (isError) return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Couldn't load orders: {error.message}
    </div>
  )

  if (!orders?.length) return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
      You haven't placed any orders yet.
    </div>
  )

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link to={`/orders/${order.id}`} key={order.id}>
          <Card className="flex items-center justify-between hover:shadow-md">
            <div>
              <p className="font-medium text-gray-900">Order #{order.id}</p>
              <p className="text-sm text-gray-500">{order.status}</p>
            </div>
            <p className="font-semibold text-brand-700">${order.total?.toFixed(2)}</p>
          </Card>
        </Link>
      ))}
    </div>
  )
}
