import { platziClient as apiClient } from './client'

const PAGE_SIZE = 12

export async function fetchProducts({ search, category, page = 1 }) {
  const offset = (page - 1) * PAGE_SIZE
  const { data } = await apiClient.get('/products', {
    params: {
      title: search || undefined,
      categoryId: category || undefined,
      offset,
      limit: PAGE_SIZE,
    },
  })
  const items = Array.isArray(data) ? data : (data?.data ?? [])
  return {
    data: items,
    meta: {
      pageSize: PAGE_SIZE,
      hasMore: items.length === PAGE_SIZE,
      page,
    },
  }
}

export async function fetchProduct(id) {
  const { data } = await apiClient.get(`/products/${id}`)
  return data
}

const REAL_CATEGORIES = new Set([
  'clothes', 'electronics', 'furniture', 'shoes', 'miscellaneous',
  'books', 'toys', 'sports', 'beauty', 'jewelry', 'home', 'accessories',
])

export async function fetchCategories() {
  const { data } = await apiClient.get('/categories')
  const items = Array.isArray(data) ? data : (data?.data ?? [])
  return items.filter((c) => {
    if (!c || !c.name) return false
    const name = c.name.trim()
    if (name.length === 0) return false
    return REAL_CATEGORIES.has(name.toLowerCase())
  })
}
