import { useParams, Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { useProduct } from '../features/products/useProduct'
import { useAddToCart } from '../features/cart/useCartMutations'
import { useToast } from '../context/ToastContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { data: product, isLoading, isError, error } = useProduct(id)
  const addToCart = useAddToCart()
  const { showToast } = useToast()

  if (isLoading) {
    return <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Couldn't load this product: {error.message}
        <div className="mt-2"><Link to="/" className="underline">Back to products</Link></div>
      </div>
    )
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <img
        src={product.images?.[0]}
        alt={product.title}
        onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image' }}
        className="w-full rounded-xl bg-gray-100 object-cover"
      />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
        <p className="mt-2 text-xl font-semibold text-brand-700">${product.price?.toFixed(2)}</p>
        <p className="mt-4 text-sm text-gray-600">{product.description}</p>
        <Button
          className="mt-6"
          disabled={addToCart.isPending}
          onClick={() =>
            addToCart.mutate(
              { productId: product.id, quantity: 1 },
              {
                onSuccess: () => showToast('Added to cart'),
                onError: (err) => showToast(err.message, 'error'),
              }
            )
          }
        >
          {addToCart.isPending ? 'Adding…' : 'Add to cart'}
        </Button>
      </div>
    </div>
  )
}
