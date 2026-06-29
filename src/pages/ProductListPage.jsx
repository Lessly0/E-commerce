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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
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
