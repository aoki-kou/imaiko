import { useCallback, useEffect, useMemo, useState } from 'react'
import { PREFECTURES } from '../../constants/prefectures'
import type { Prefecture } from '../../constants/prefectures'
import { useAuth } from '../auth/useAuth'
import { PlacesApiError, deletePlace, fetchPlaces } from './placesApi'
import type { Place } from './placesApi'

export type PlaceCounts = Record<Prefecture, number>

/** 都道府県ごとの保存件数を数える(全47都道府県を0件で初期化する) */
export function countPlacesByPrefecture(places: Place[]): PlaceCounts {
  const counts = Object.fromEntries(PREFECTURES.map((prefecture) => [prefecture, 0])) as PlaceCounts
  for (const place of places) {
    if (place.prefecture in counts) counts[place.prefecture as Prefecture] += 1
  }
  return counts
}

/**
 * ログインユーザーの場所を全件取得し、都道府県ごとの件数とあわせて返す。
 * バックエンドは変更せず、既存の GET /places(全件)をフロントエンドで集計する。
 */
export function usePlaces() {
  const { token } = useAuth()
  const [places, setPlaces] = useState<Place[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    if (!token) return
    let ignore = false

    fetchPlaces(token)
      .then((result) => {
        if (!ignore) setPlaces(result)
      })
      .catch((err) => {
        if (!ignore) setLoadError(err instanceof PlacesApiError ? err.errors[0] : '場所一覧の取得に失敗しました')
      })

    return () => {
      ignore = true
    }
  }, [token, reloadCount])

  const reload = useCallback(() => {
    setPlaces(null)
    setLoadError(null)
    setReloadCount((n) => n + 1)
  }, [])

  /** 削除に成功したら一覧から取り除く(地図の色にもすぐ反映される)。失敗時は例外を投げ、一覧は変更しない */
  const removePlace = useCallback(
    async (id: number) => {
      if (!token) return
      await deletePlace(token, id)
      setPlaces((prev) => prev?.filter((place) => place.id !== id) ?? prev)
    },
    [token],
  )

  const counts = useMemo(() => countPlacesByPrefecture(places ?? []), [places])

  return { places, counts, loadError, reload, removePlace }
}
