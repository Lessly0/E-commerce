import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useAddToCart } from '../../features/cart/useCartMutations'

const REAL_CATEGORIES = new Set([
  'clothes', 'electronics', 'furniture', 'shoes', 'miscellaneous',
  'books', 'toys', 'sports', 'beauty', 'jewelry', 'home', 'accessories',
])

export default function ProductCard({ product }) {
  const addToCart = useAddToCart()
  const categoryName = product.category?.name?.trim()
  const showCategory = categoryName && REAL_CATEGORIES.has(categoryName.toLowerCase())

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    addToCart.mutate({ productId: product.id, quantity: 1 })
  }
  return (
    <Card className="group flex h-full flex-col gap-3 overflow-hidden p-0 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <img
            src={product.images?.[0]}
            alt={product.title}
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400?text=No+Image' }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {showCategory && (
            <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-700 backdrop-blur">
              {categoryName}
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-brand-700">
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="text-base font-bold text-brand-700">${product.price?.toFixed(2)}</p>
          <Button size="sm" onClick={handleAdd} loading={addToCart.isPending}>
            Add to cart
          </Button>
        </div>
      </div>
    </Card>
  )
}
