import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import { PlacesApiError, deletePlace, fetchPlaces } from '../features/places/placesApi'
import type { Place } from '../features/places/placesApi'

export function PlacesPage() {
  const { token } = useAuth()
  const [searchParams] = useSearchParams()
  const prefecture = searchParams.get('prefecture')

  const [places, setPlaces] = useState<Place[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    setPlaces(null)
    setLoadError(null)
    setDeleteError(null)

    if (!token || !prefecture) return

    fetchPlaces(token, prefecture)
      .then(setPlaces)
      .catch((err) => {
        setLoadError(err instanceof PlacesApiError ? err.errors[0] : '場所一覧の取得に失敗しました')
      })
  }, [token, prefecture])

  async function handleDelete(place: Place) {
    if (!token) return
    if (!window.confirm(`「${place.name}」を削除しますか？`)) return

    setDeleteError(null)
    setDeletingId(place.id)
    try {
      await deletePlace(token, place.id)
      setPlaces((prev) => prev?.filter((p) => p.id !== place.id) ?? prev)
    } catch (err) {
      setDeleteError(err instanceof PlacesApiError ? err.errors[0] : '場所の削除に失敗しました')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main>
      <p>
        <Link to="/">都道府県選択に戻る</Link>
      </p>
      <h1>{prefecture ?? '未選択'}の場所一覧</h1>

      {deleteError && <p role="alert">{deleteError}</p>}

      {!prefecture && <p>都道府県が選択されていません</p>}

      {prefecture && loadError && <p role="alert">{loadError}</p>}

      {prefecture && !loadError && places === null && <p>読み込み中です</p>}

      {prefecture && !loadError && places !== null && places.length === 0 && (
        <p>登録された場所がありません</p>
      )}

      {prefecture && !loadError && places !== null && places.length > 0 && (
        <ul>
          {places.map((place) => (
            <li key={place.id}>
              <p>{place.name}</p>
              {place.url && (
                <p>
                  <a href={place.url} target="_blank" rel="noreferrer">
                    {place.url}
                  </a>
                </p>
              )}
              {place.memo && <p>{place.memo}</p>}
              <button
                type="button"
                onClick={() => handleDelete(place)}
                disabled={deletingId === place.id}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
