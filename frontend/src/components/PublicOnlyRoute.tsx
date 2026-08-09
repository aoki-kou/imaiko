import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'

export function PublicOnlyRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <p>読み込み中...</p>
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
