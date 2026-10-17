import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import { AuthLoading } from './AuthLoading'

export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  // errorはApp側でエラー画面を表示するため通常ここには来ないが、未認証のまま保護ページを表示しないよう防御する
  if (status === 'loading' || status === 'error') {
    return <AuthLoading />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
