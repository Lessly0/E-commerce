import apiClient from './client'

export async function login({ email, password }) {
  const { data } = await apiClient.post('/auth/login', { email, password })
  return data
}

export async function register({ name, email, password }) {
  const { data } = await apiClient.post('/auth/register', { name, email, password })
  return data
}

export async function forgotPassword(email) {
  const { data } = await apiClient.post('/auth/forgot-password', { email })
  return data
}

export async function resetPassword(token, password) {
  const { data } = await apiClient.post(`/auth/reset-password/${token}`, { password })
  return data
}

export async function verifyAccount(token) {
  const { data } = await apiClient.get(`/auth/verify/${token}`)
  return data
}

// No profile endpoint on the custom backend; resolve the user from the JWT.
export function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { id: payload.userId, ...payload }
  } catch {
    return null
  }
}
