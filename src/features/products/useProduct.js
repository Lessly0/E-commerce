import { useQuery } from '@tanstack/react-query'
import { fetchProduct } from '../../api/products'

export function useProduct(id) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  })
}
