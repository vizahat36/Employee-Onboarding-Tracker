import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated, getUser } from '../services/authService.js'

export default function ProtectedRoute({ role }) {
  const user = getUser()

  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/attendee'} replace />
  }

  return <Outlet />
}