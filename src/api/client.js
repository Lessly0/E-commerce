import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

const platziClient = axios.create({
  baseURL: import.meta.env.VITE_PLATZI_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

function attachAuth(config) {
  const token = localStorage.getItem('authToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}

function normalizeError(error) {
  return {
    message: error.response?.data?.message || error.message || 'Something went wrong. Please try again.',
    status: error.response?.status,
    original: error,
  }
}

apiClient.interceptors.request.use(attachAuth)
platziClient.interceptors.request.use(attachAuth)

apiClient.interceptors.response.use((r) => r, (e) => Promise.reject(normalizeError(e)))
platziClient.interceptors.response.use((r) => r, (e) => Promise.reject(normalizeError(e)))

export default apiClient
export { platziClient }
