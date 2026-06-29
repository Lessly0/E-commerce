import apiClient from './client'

const CART_ID_KEY = 'cartId'

export function getCartId() {
  return localStorage.getItem(CART_ID_KEY)
}

function setCartId(id) {
  if (id) localStorage.setItem(CART_ID_KEY, id)
}

export async function fetchCart() {
  const cartId = getCartId()
  if (!cartId) return { id: null, items: [], total: 0 }
  const { data } = await apiClient.get(`/cart/${cartId}`)
  return data
}

export async function addCartItem({ productId, quantity }) {
  const cartId = getCartId()
  const { data } = await apiClient.post('/cart/items', {
    cartId,
    productId,
    quantity,
  })
  setCartId(data.id)
  return data
}

export async function updateCartItem({ itemId, quantity }) {
  const { data } = await apiClient.patch(`/cart/items/${itemId}`, { quantity })
  return data
}

export async function removeCartItem(itemId) {
  const { data } = await apiClient.delete(`/cart/items/${itemId}`)
  return data
}
