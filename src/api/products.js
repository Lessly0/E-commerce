import apiClient from './client'

export async function fetchProducts({ search, category, page = 1 }) {
  const { data } = await apiClient.get('/products', {
    params: { search, category, page },
  })
  return data
}

export async function fetchProduct(id) {
  const { data } = await apiClient.get(`/products/${id}`)
  return data
}

export async function fetchCategories() {
  const { data } = await apiClient.get('/categories')
  return data
}
