import apiClient from './client'

export async function fetchProducts({ search, category, page = 1 }) {
  const { data } = await apiClient.get('/products', {
    params: { search, category, page },
  })
  // Normalize: API may return [] directly or { data: [], meta: {} }
  if (Array.isArray(data)) return { data, meta: { totalPages: 1 } }
  return data
}

export async function fetchProduct(id) {
  const { data } = await apiClient.get(`/products/${id}`)
  return data
}

export async function fetchCategories() {
  const { data } = await apiClient.get('/categories')
  return Array.isArray(data) ? data : (data?.data ?? [])
}
