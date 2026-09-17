import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'
import { PageContainer } from '../components/ui/PageContainer'
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
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <Logo />
        <Button type="button" onClick={handleLogout} size="sm">
          ログアウト
        </Button>
      </div>
      <p className="mb-6 text-sm text-brand-muted">ログイン中: {user?.email}</p>

      <h2 className="mb-2 text-lg font-bold text-brand-text">都道府県を選択</h2>
      <ul className="divide-y divide-brand-border rounded-2xl border border-brand-border bg-brand-surface">
        {PREFECTURES.map((prefecture) => (
          <li key={prefecture}>
            <Link
              to={{
                pathname: '/places',
                search: createSearchParams({ prefecture }).toString(),
              }}
              className="block px-4 py-3 text-brand-text hover:bg-brand-primary-light"
            >
              {prefecture}
            </Link>
          </li>
        ))}
      </ul>
    </PageContainer>
  )
}
