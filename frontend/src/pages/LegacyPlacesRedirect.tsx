import { Navigate, useSearchParams } from 'react-router-dom'
import { mapHomePath } from '../features/shiori/useSelectedPrefecture'

/**
 * 旧URL /places?prefecture=京都府 を /?prefecture=京都府 へ置き換えて転送する(旧URLには戻らない)。
 * クエリのない /places は、#19で全件一覧を実装するまで地図ホーム(/)へ転送する。
 * 存在しない都道府県名の場合も / へ転送する。
 */
export function LegacyPlacesRedirect() {
  const [searchParams] = useSearchParams()
  return <Navigate to={mapHomePath(searchParams.get('prefecture'))} replace />
}
