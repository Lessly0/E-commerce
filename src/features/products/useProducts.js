import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../../api/products'

export function useProducts({ search, category, page }) {
  return useQuery({
    queryKey: ['products', { search, category, page }],
    queryFn: () => fetchProducts({ search, category, page }),
    keepPreviousData: true,
  })
}
