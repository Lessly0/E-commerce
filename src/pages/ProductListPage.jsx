import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import ProductCard from '../features/products/ProductCard'
import { useProducts } from '../features/products/useProducts'
import { useCategories } from '../features/products/useCategories'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

export default function ProductListPage() {
  const [searchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const s = searchParams.get('search')
    if (s !== null) setSearchInput(s)
    const c = searchParams.get('category')
    if (c !== null) {
      setCategory(c)
      setPage(1)
    }
  }, [searchParams])

  const debouncedSearch = useDebouncedValue(searchInput, 400)

  const { data, isLoading, isError, error, isFetching } = useProducts({
    search: debouncedSearch,
    category,
    page,
  })
  const { data: categories = [] } = useCategories()

  const products = data?.data ?? []
  const hasMore = data?.meta?.hasMore ?? false

  function handleCategoryChange(id) {
    setCategory(id)
    setPage(1)
  }

  return (
    <div>
      <section className="-mx-4 mb-10 relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-500 px-4 py-20 text-center text-white sm:py-24">
        <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
            New arrivals every week
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Shop everything,
            <br />
            <span className="text-brand-100">simply.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-white/80 sm:text-lg">
            Browse our latest collection and find something you'll love.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#products" className="rounded-lg bg-white px-8 py-3 text-sm font-semibold text-brand-700 shadow-lg hover:bg-brand-50 transition-colors">
              Shop now
            </a>
            <a href="#products" className="rounded-lg border border-white/40 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10 transition-colors">
              View deals
            </a>
          </div>
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

      <section id="products" className="scroll-mt-24">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              id="search"
              label="Search products"
              placeholder="Search by name…"
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setPage(1) }}
            />
          </div>
          <div className="w-full sm:w-56">
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === ''
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {categories.slice(0, 8).map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryChange(String(c.id))}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  category === String(c.id)
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-0">
                <div className="skeleton aspect-square w-full" />
                <div className="space-y-2 p-4">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Couldn't load products: {error?.message}
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">🔍</div>
            <p className="font-medium text-gray-900">No products match your search.</p>
            <p className="mt-1 text-sm text-gray-500">Try a different keyword or category.</p>
            <Button variant="secondary" className="mt-4" onClick={() => { setSearchInput(''); setCategory(''); setPage(1) }}>
              Clear filters
            </Button>
          </div>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page}
                {isFetching && ' · updating…'}
              </span>
              <Button
                variant="secondary"
                disabled={!hasMore || isFetching}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

