import { useMutation, useQueryClient } from '@tanstack/react-query'
import { placeOrder } from '../../api/orders'

export function usePlaceOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
