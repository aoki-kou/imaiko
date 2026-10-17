import { useEffect, useState } from 'react'
import { useAuth } from '../features/auth/useAuth'
import { markSplashShown } from '../features/splash/splashStorage'
import { SlowConnectionNotice } from './SlowConnectionNotice'
import { Logo } from './ui/Logo'

const MIN_DISPLAY_MS = 1_200
const FADE_OUT_MS = 300

type SplashScreenProps = {
  onFinish: () => void
}

// 画面全体を覆うオーバーレイとして表示し、背面のルーティング(認証状態に応じたリダイレクト等)はそのまま進める。
// 最低表示時間の経過と認証確認の完了の両方を満たした時点でフェードアウトする
export function SplashScreen({ onFinish }: SplashScreenProps) {
  const { status } = useAuth()
  const [minDisplayElapsed, setMinDisplayElapsed] = useState(false)
  const finishing = minDisplayElapsed && status !== 'loading'

  useEffect(() => {
    markSplashShown()
    const timerId = setTimeout(() => setMinDisplayElapsed(true), MIN_DISPLAY_MS)
    return () => clearTimeout(timerId)
  }, [])

  useEffect(() => {
    if (!finishing) return
    const timerId = setTimeout(onFinish, FADE_OUT_MS)
    return () => clearTimeout(timerId)
  }, [finishing, onFinish])

  return (
    <div
      role="status"
      aria-label="イマイコを起動しています"
      className={[
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-bg px-4',
        'transition-opacity duration-300 motion-reduce:transition-none',
        finishing ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      <Logo tagline />
      {status === 'loading' && <SlowConnectionNotice />}
    </div>
  )
}
