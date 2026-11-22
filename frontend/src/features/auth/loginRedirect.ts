import type { Location, To } from 'react-router-dom'

/**
 * ログイン後の移動先。未ログインで保護ページを開いたときに ProtectedRoute が state.from に記録したURLへ戻す。
 * /?prefecture=京都府 のようなクエリも引き継ぐ
 */
export function loginRedirectTarget(state: unknown): To {
  const from = (state as { from?: Location } | null)?.from
  return from ? { pathname: from.pathname, search: from.search, hash: from.hash } : '/'
}
