import { useEffect, useState } from 'react'
import { Link, createSearchParams, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageContainer } from '../components/ui/PageContainer'
import { PageHeader } from '../components/ui/PageHeader'
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
    <PageContainer>
      <PageHeader
        backTo="/"
        backLabel="都道府県選択に戻る"
        title={`${prefecture ?? '未選択'}の場所一覧`}
        action={
          prefecture && (
            <Link
              to={{ pathname: '/places/new', search: createSearchParams({ prefecture }).toString() }}
              className="text-sm text-brand-primary hover:underline"
            >
              新規登録
            </Link>
          )
        }
      />

      {deleteError && (
        <p role="alert" className="mb-4 rounded-xl bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {deleteError}
        </p>
      )}

      {!prefecture && <p className="text-brand-muted">都道府県が選択されていません</p>}

      {prefecture && loadError && (
        <p role="alert" className="rounded-xl bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {loadError}
        </p>
      )}

      {prefecture && !loadError && places === null && <p className="text-brand-muted">読み込み中です</p>}

      {prefecture && !loadError && places !== null && places.length === 0 && (
        <p className="text-brand-muted">登録された場所がありません</p>
      )}

      {prefecture && !loadError && places !== null && places.length > 0 && (
        <ul className="space-y-3">
          {places.map((place) => (
            <li key={place.id}>
              <Card>
                <p className="font-semibold text-brand-text">{place.name}</p>
                {place.url && (
                  <p className="mt-1 truncate text-sm">
                    <a
                      href={place.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-primary hover:underline"
                    >
                      {place.url}
                    </a>
                  </p>
                )}
                {place.memo && <p className="mt-1 text-sm text-brand-muted">{place.memo}</p>}
                <div className="mt-3 flex items-center gap-3">
                  <Link to={`/places/${place.id}/edit`} className="text-sm text-brand-primary hover:underline">
                    編集
                  </Link>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(place)}
                    disabled={deletingId === place.id}
                  >
                    削除
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  )
}
