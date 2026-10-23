import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { resetPassword } from '../../../api/auth'
import { useToast } from '../../../context/ToastContext'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!password) { setError('Password is required'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    setError('')
    setSubmitting(true)
    try {
      await resetPassword(token, password)
      setDone(true)
      showToast('Password reset successfully')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err?.message || 'Reset failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
          <p className="mt-1 text-sm text-gray-500">Enter your new password.</p>
        </div>
        {done ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            Password reset successfully. Redirecting to sign in…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="password" label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Input id="confirm" label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={error} />
            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              {submitting ? 'Resetting…' : 'Reset password'}
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link to="/login" className="font-medium text-brand-700 hover:underline">Back to sign in</Link>
        </p>
      </Card>
    </div>
  )
}
