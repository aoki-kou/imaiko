import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { loginRedirectTarget } from '../features/auth/loginRedirect'
import { useAuth } from '../features/auth/useAuth'
import { AuthLoading } from './AuthLoading'

export function PublicOnlyRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <AuthLoading />
  }

  if (status === 'authenticated') {
    // ログインした直後もここを通るため、ログイン前に開こうとしたURLへ戻す(LoginPageの移動先と同じ)
    return <Navigate to={loginRedirectTarget(location.state)} replace />
  }

  return <Outlet />
}
