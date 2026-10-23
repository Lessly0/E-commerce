import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useProduct } from '../features/products/useProduct'
import { useAddToCart } from '../features/cart/useCartMutations'
import { useToast } from '../context/ToastContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { data: product, isLoading, isError, error } = useProduct(id)
  const addToCart = useAddToCart()
  const { showToast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  if (isLoading) {
    return (
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="skeleton aspect-square w-full rounded-xl" />
        <div className="space-y-4">
          <div className="skeleton h-6 w-2/3" />
          <div className="skeleton h-5 w-1/4" />
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-10 w-32" />
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Couldn't load this product: {error?.message}
        <div className="mt-2"><Link to="/" className="underline">Back to products</Link></div>
      </div>
    )
  }

  const images = product.images?.length ? product.images : ['https://placehold.co/600x600?text=No+Image']

  function handleAdd() {
    addToCart.mutate(
      { productId: product.id, quantity },
      {
        onSuccess: () => showToast(`Added ${quantity} to cart`),
        onError: (err) => showToast(err.message, 'error'),
      }
    )
  }

  return (
    <div>
      <nav className="mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span className="mx-2">/</span>
        {product.category?.name && (
          <>
            <span>{product.category.name}</span>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-900">{product.title}</span>
      </nav>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl bg-gray-100">
            <img
              src={images[activeImage]}
              alt={product.title}
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image' }}
              className="aspect-square w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === i ? 'border-brand-600' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          {product.category?.name && (
            <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
              {product.category.name}
            </span>
          )}
          <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">{product.title}</h1>
          <p className="mt-2 text-2xl font-bold text-brand-700">${product.price?.toFixed(2)}</p>

          <p className="mt-4 text-sm leading-relaxed text-gray-600">{product.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <label htmlFor="qty" className="text-sm font-medium text-gray-700">Qty</label>
            <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                id="qty"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="w-14 border-x border-gray-300 py-2 text-center text-sm focus:outline-none"
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              loading={addToCart.isPending}
              onClick={handleAdd}
              className="sm:flex-1"
            >
              {addToCart.isPending ? 'Adding…' : 'Add to cart'}
            </Button>
            <Button variant="secondary" size="lg" onClick={handleAdd}>
              Buy now
            </Button>
          </div>

          <Card className="mt-8 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              In stock and ready to ship
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-brand-600" viewBox="0 0 20 20" fill="currentColor"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/></svg>
              Free shipping over $50
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-brand-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/></svg>
              30-day easy returns
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

