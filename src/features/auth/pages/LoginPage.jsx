import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { useAuth } from '../../../context/AuthContext'
import { useToast } from '../../../context/ToastContext'

export default function LoginPage() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function handleChange(field) {
    return (e) => setForm((p) => ({ ...p, [field]: e.target.value }))
  }

  function validate() {
    const next = {}
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!form.password) next.password = 'Password is required'
    else if (form.password.length < 4) next.password = 'Password is too short'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await login(form)
      showToast('Welcome back!')
      navigate('/')
    } catch (err) {
      showToast(err?.message || 'Login failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="email" label="Email address" type="email" value={form.email} onChange={handleChange('email')} error={errors.email} autoComplete="email" />
          <Input id="password" label="Password" type="password" value={form.password} onChange={handleChange('password')} error={errors.password} autoComplete="current-password" />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-brand-700 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" size="lg" className="w-full" loading={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-700 hover:underline">
            Create one
          </Link>
        </p>
      </Card>
    </div>
  )
}
