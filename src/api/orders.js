const ORDERS_KEY = 'orders'
const CART_KEY = 'cart'

export async function fetchOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export async function fetchOrder(id) {
  const orders = await fetchOrders()
  return orders.find((order) => String(order.id) === String(id)) || null
}

export async function placeOrder(payload) {
  let cart = { items: [] }
  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}')
  } catch {
    cart = { items: [] }
  }
  const items = cart.items || []
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const order = {
    id: Date.now(),
    items: items.map((item) => ({ ...item })),
    total,
    status: 'pending',
    shippingAddress: payload?.shippingAddress,
    createdAt: new Date().toISOString(),
  }

  const orders = await fetchOrders()
  orders.unshift(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  localStorage.removeItem(CART_KEY)
  return order
}
