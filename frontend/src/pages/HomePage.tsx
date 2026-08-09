import { useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'

export function HomePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <main>
      <h1>イマイコ(仮)</h1>
      <p>ログイン中: {user?.email}</p>
      <button type="button" onClick={handleLogout}>
        ログアウト
      </button>
    </main>
  )
}
