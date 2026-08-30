import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { PREFECTURES } from '../constants/prefectures'
import { useAuth } from '../features/auth/useAuth'

export function PrefectureListPage() {
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
      <h2>都道府県を選択</h2>
      <ul>
        {PREFECTURES.map((prefecture) => (
          <li key={prefecture}>
            <Link
              to={{
                pathname: '/places',
                search: createSearchParams({ prefecture }).toString(),
              }}
            >
              {prefecture}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
