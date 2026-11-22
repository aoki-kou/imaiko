import { useCallback, useEffect } from 'react'
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { isPrefecture } from '../../constants/prefectures'
import type { Prefecture } from '../../constants/prefectures'

/** 地図の中で都道府県を選んで開いたことを、履歴のstateに記録する(閉じるときに1つ戻れるかの判定に使う) */
type ShioriLocationState = { openedFromMap?: boolean } | null

/** 地図ホームで特定の都道府県を開くURL */
export function mapHomePath(prefecture?: string | null): string {
  return prefecture && isPrefecture(prefecture) ? `/?${createSearchParams({ prefecture })}` : '/'
}

/**
 * 地図ホームで選択中の都道府県を URL(/?prefecture=)で扱う。
 * 戻る操作の方針は docs/development-plan.md 3章「URLとブラウザの戻る操作」のとおり。
 */
export function useSelectedPrefecture() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const raw = searchParams.get('prefecture')
  const selected: Prefecture | null = raw !== null && isPrefecture(raw) ? raw : null
  const invalid = raw !== null && selected === null
  const openedFromMap = (location.state as ShioriLocationState)?.openedFromMap === true

  // 存在しない都道府県名を指定して開いた場合は、未選択の地図へ置き換える
  useEffect(() => {
    if (invalid) navigate('/', { replace: true })
  }, [invalid, navigate])

  const select = useCallback(
    (prefecture: Prefecture) => {
      if (prefecture === selected) return
      navigate(mapHomePath(prefecture), {
        // 未選択から開くときは履歴に追加し、開いたまま切り替えるときは置き換える(戻る1回で未選択の地図へ)
        replace: selected !== null,
        state: { openedFromMap: selected === null ? true : openedFromMap } satisfies ShioriLocationState,
      })
    },
    [navigate, selected, openedFromMap],
  )

  const clear = useCallback(() => {
    if (selected === null) return
    // 地図の中で開いた場合は1つ戻って未選択の地図へ。URLを直接開いた場合は戻る先がアプリ外の可能性があるため置き換える
    if (openedFromMap) {
      navigate(-1)
    } else {
      navigate('/', { replace: true })
    }
  }, [navigate, selected, openedFromMap])

  return { selected, select, clear }
}
