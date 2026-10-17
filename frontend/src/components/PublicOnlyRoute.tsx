import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import { AuthLoading } from './AuthLoading'

export function PublicOnlyRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <AuthLoading />
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
