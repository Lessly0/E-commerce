import { platziClient } from './client'

const CART_KEY = 'cart'

function emptyCart() {
  return { id: 'local-cart', items: [], total: 0 }
}

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

function recalc(cart) {
  cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return cart
}

export function getCartId() {
  return 'local-cart'
}

export async function fetchCart() {
  return recalc(readCart() || emptyCart())
}

export async function addCartItem({ productId, quantity }) {
  const { data: product } = await platziClient.get(`/products/${productId}`)
  const cart = readCart() || emptyCart()
  const existing = cart.items.find((item) => item.productId === productId)
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.items.push({
      id: productId,
      productId,
      title: product.title,
      price: product.price,
      image: Array.isArray(product.images) ? product.images[0] : product.image,
      quantity,
    })
  }
  writeCart(recalc(cart))
  return readCart()
}

export async function updateCartItem({ itemId, quantity }) {
  const cart = readCart() || emptyCart()
  const item = cart.items.find((i) => i.id === itemId || i.productId === itemId)
  if (item) item.quantity = Math.max(1, quantity)
  writeCart(recalc(cart))
  return readCart()
}

export async function removeCartItem(itemId) {
  const cart = readCart() || emptyCart()
  cart.items = cart.items.filter((i) => i.id !== itemId && i.productId !== itemId)
  writeCart(recalc(cart))
  return readCart()
}
