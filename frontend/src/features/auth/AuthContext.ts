import { createContext } from 'react'
import type { AuthUser } from './authApi'

// error: 起動時の認証確認がタイムアウト・通信エラー等で完了できなかった状態(トークンは保持)
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error'

export type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, passwordConfirmation: string) => Promise<void>
  logout: () => Promise<void>
  retry: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
