import { Navigate, Link, useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { useAuth } from '../../../context/AuthContext'

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const initials = (user?.name || 'U').trim().charAt(0).toUpperCase()

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl font-semibold text-white">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Account'}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
            {user?.role && <p className="text-xs text-gray-400">Role: {user.role}</p>}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/orders" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            My orders
          </Link>
          <Button
            variant="secondary"
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            Sign out
          </Button>
        </div>
      </Card>
    </div>
  )
}