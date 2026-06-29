import { useQuery } from '@tanstack/react-query'
import { fetchCart } from '../../api/cart'

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
  })
}
