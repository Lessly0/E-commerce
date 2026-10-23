import { createContext, useContext, useEffect, useState } from 'react'
import { login as loginApi, register as registerApi, decodeToken } from '../api/auth'

const AuthContext = createContext(null)

const TOKEN_KEY = 'authToken'
const USER_KEY = 'authUser'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token && !user) {
      const decoded = decodeToken(token)
      if (decoded) {
        const u = { id: decoded.userId, email: decoded.email, name: decoded.name }
        localStorage.setItem(USER_KEY, JSON.stringify(u))
        setUser(u)
      }
    }
    setLoading(false)
  }, [token])

  async function login(credentials) {
    const data = await loginApi(credentials)
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    const decoded = decodeToken(data.token)
    const u = {
      id: decoded?.userId,
      email: credentials.email,
      name: decoded?.name || credentials.email.split('@')[0],
    }
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUser(u)
    return u
  }

  async function register(payload) {
    const data = await registerApi({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    })
    return data
  }

  async function updateProfile(payload) {
    const updated = { ...user, ...payload }
    localStorage.setItem(USER_KEY, JSON.stringify(updated))
    setUser(updated)
    return updated
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, updateProfile, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
