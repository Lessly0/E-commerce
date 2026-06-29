import { useQuery } from '@tanstack/react-query'
import { fetchOrders, fetchOrder } from '../../api/orders'

export function useOrders() {
  return useQuery({ queryKey: ['orders'], queryFn: fetchOrders })
}

export function useOrder(id) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => fetchOrder(id),
    enabled: !!id,
  })
}
