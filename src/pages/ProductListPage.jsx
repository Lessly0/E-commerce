import { useState } from 'react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import ProductCard from '../features/products/ProductCard'
import { useProducts } from '../features/products/useProducts'
import { useCategories } from '../features/products/useCategories'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

export default function ProductListPage() {
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebouncedValue(searchInput, 400)

  const { data, isLoading, isError, error, isFetching } = useProducts({
    search: debouncedSearch,
    category,
    page,
  })
  const { data: categories } = useCategories()

  return (
    <div>
      {/* Hero */}
      <section className="-mx-4 mb-10 relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-500 px-4 py-24 text-center text-white">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="pointer-events-none absolute top-8 right-24 h-32 w-32 rounded-full bg-brand-400/20 blur-2xl" />

        <div className="relative">
          <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
            New arrivals every week
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Shop everything,
            <br />
            <span className="text-brand-100">simply.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-white/80 sm:text-lg">
            Browse our latest collection and find something you'll love — fast shipping, easy returns.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#products"
              className="rounded-lg bg-white px-8 py-3 text-sm font-semibold text-brand-700 shadow-lg hover:bg-brand-50 transition-colors"
            >
              Shop now
            </a>
            <a
              href="#products"
              className="rounded-lg border border-white/40 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              View deals
            </a>
          </div>

          {/* stats strip */}
          <div className="mt-12 flex justify-center gap-10 text-center">
            {[['500+', 'Products'], ['Free', 'Shipping'], ['24/7', 'Support']].map(([stat, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold">{stat}</p>
                <p className="text-xs text-white/70 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="products" className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            id="search"
            label="Search products"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1) }}
          />
        </div>
        <div className="w-full sm:w-48">
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1) }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="">All categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Couldn't load products: {error.message}
        </div>
      )}

      {!isLoading && !isError && data?.data?.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          No products match your search.
        </div>
      )}

      {!isLoading && !isError && data?.data?.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.data.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {data.meta?.totalPages ?? '?'}
              {isFetching && ' · updating…'}
            </span>
            <Button
              variant="secondary"
              disabled={page >= (data.meta?.totalPages ?? 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
