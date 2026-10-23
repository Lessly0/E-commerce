import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import { useOrders } from '../features/orders/useOrders'

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrderHistoryPage() {
  const { data: orders, isLoading, isError, error } = useOrders()

  if (isLoading) return <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Couldn't load orders: {error?.message}
      </div>
    )
  }

  if (!orders?.length) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl">📦</div>
        <h2 className="text-lg font-bold text-gray-900">No orders yet</h2>
        <p className="mt-1 text-sm text-gray-500">When you place an order, it will appear here.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Start shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Order history</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link to={`/orders/${order.id}`} key={order.id}>
            <Card className="flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-700 font-bold">
                  #{order.id}
                </div>
                <div>
                  <p className="font-medium text-gray-900">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    statusStyles[order.status?.toLowerCase()] ?? 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {order.status}
                </span>
                <p className="font-semibold text-brand-700">${order.total?.toFixed(2)}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
