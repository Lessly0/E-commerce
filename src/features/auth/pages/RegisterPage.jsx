import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { useAuth } from '../../../context/AuthContext'
import { useToast } from '../../../context/ToastContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function handleChange(field) {
    return (e) => setForm((p) => ({ ...p, [field]: e.target.value }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    else if (form.name.trim().length < 2) next.name = 'Name is too short'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!form.password) next.password = 'Password is required'
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters'
    if (!form.confirmPassword) next.confirmPassword = 'Please confirm your password'
    else if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const data = await register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      if (data?.verificationEmailSent) {
        showToast('Account created! Check your email to verify.')
      } else {
        showToast('Account created! We could not send the verification email.')
      }
      navigate('/login')
    } catch (err) {
      showToast(err?.message || 'Registration failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mt-1 text-sm text-gray-500">Join E-Comus and start shopping today.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="name" label="Full name" value={form.name} onChange={handleChange('name')} error={errors.name} autoComplete="name" />
          <Input id="email" label="Email address" type="email" value={form.email} onChange={handleChange('email')} error={errors.email} autoComplete="email" />
          <Input id="password" label="Password" type="password" value={form.password} onChange={handleChange('password')} error={errors.password} autoComplete="new-password" />
          <Input id="confirmPassword" label="Confirm password" type="password" value={form.confirmPassword} onChange={handleChange('confirmPassword')} error={errors.confirmPassword} autoComplete="new-password" />
          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input type="checkbox" required className="mt-0.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>
          <Button type="submit" size="lg" className="w-full" loading={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-700 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
