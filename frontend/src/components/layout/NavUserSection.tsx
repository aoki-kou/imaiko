import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { NavIcon } from '../ui/NavIcon'
import { NAV_FOCUS_RING } from './navStyles'

type NavUserSectionProps = {
  /** sidebar: PCの縦書きサイドバー(幅が狭いため簡略表示) / menu: スマホの全画面メニュー */
  variant: 'sidebar' | 'menu'
  /** メニュー内のリンクを選んだときに呼ぶ(スマホのメニューを閉じる) */
  onNavigate?: () => void
}

/** ログイン中のユーザー表示と、プライバシーポリシー・ログアウトへの導線 */
export function NavUserSection({ variant, onNavigate }: NavUserSectionProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const email = user?.email ?? ''
  const initial = email.charAt(0).toUpperCase()

  async function handleLogout() {
    setLoggingOut(true)
    await logout()
    navigate('/login', { replace: true })
  }

  const avatar = (
    <span
      aria-hidden="true"
      className="grid size-10 flex-none place-items-center rounded-full bg-brand-surface font-display font-bold text-brand-primary shadow-[0_0_0_2px_var(--color-brand-gold)]"
    >
      {initial}
    </span>
  )

  if (variant === 'sidebar') {
    const itemClass = `flex w-[72px] flex-col items-center gap-1 rounded-xl py-2 text-[10px] text-brand-on-primary-muted transition-colors hover:bg-white/7 hover:text-white disabled:opacity-60 ${NAV_FOCUS_RING}`

    return (
      <div className="mt-3 flex flex-col items-center gap-1 border-t border-white/12 pt-3">
        <div title={email} className="mb-1">
          {avatar}
          <span className="sr-only">ログイン中: {email}</span>
        </div>
        <Link to="/privacy" aria-label="プライバシーポリシー" className={itemClass}>
          <NavIcon name="privacy" className="size-[18px]" />
          <span aria-hidden="true">プライバシー</span>
        </Link>
        <button type="button" onClick={handleLogout} disabled={loggingOut} className={itemClass}>
          <NavIcon name="logout" className="size-[18px]" />
          ログアウト
        </button>
      </div>
    )
  }

  const linkClass = `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-brand-on-primary transition-colors hover:bg-white/8 hover:text-white disabled:opacity-60 ${NAV_FOCUS_RING}`

  return (
    <div className="border-t border-white/12 pt-4">
      <div className="flex items-center gap-3">
        {avatar}
        <p className="min-w-0 text-sm">
          <span className="block text-xs text-brand-on-primary-muted">ログイン中</span>
          <span className="block truncate text-white">{email}</span>
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link to="/privacy" onClick={onNavigate} className={linkClass}>
          <NavIcon name="privacy" className="size-[18px]" />
          プライバシーポリシー
        </Link>
        <button type="button" onClick={handleLogout} disabled={loggingOut} className={linkClass}>
          <NavIcon name="logout" className="size-[18px]" />
          ログアウト
        </button>
      </div>
    </div>
  )
}
