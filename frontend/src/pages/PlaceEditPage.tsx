import { useEffect, useState } from 'react'
import { createSearchParams, useNavigate, useParams } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { PageHeader } from '../components/ui/PageHeader'
import { useAuth } from '../features/auth/useAuth'
import { PlaceForm } from '../features/places/PlaceForm'
import { PlacesApiError, fetchPlace, updatePlace } from '../features/places/placesApi'
import type { Place, PlaceInput } from '../features/places/placesApi'

export function PlaceEditPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [place, setPlace] = useState<Place | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token || !id) return

    setPlace(null)
    setLoadError(null)

    fetchPlace(token, Number(id))
      .then(setPlace)
      .catch((err) => {
        setLoadError(err instanceof PlacesApiError ? err.errors[0] : '場所情報の取得に失敗しました')
      })
  }, [token, id])

  async function handleSubmit(input: PlaceInput) {
    if (!token || !id) return

    setErrors([])
    setSubmitting(true)
    try {
      const updated = await updatePlace(token, Number(id), input)
      navigate(`/places?${createSearchParams({ prefecture: updated.prefecture })}`)
    } catch (err) {
      setErrors(err instanceof PlacesApiError ? err.errors : ['場所の更新に失敗しました'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageContainer>
      <PageHeader backTo="/" backLabel="都道府県選択に戻る" title="場所の編集" />

      {loadError && (
        <p role="alert" className="rounded-xl bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {loadError}
        </p>
      )}

      {!loadError && !place && <p className="text-brand-muted">読み込み中です</p>}

      {!loadError && place && (
        <PlaceForm
          initialValues={{
            name: place.name,
            prefecture: place.prefecture,
            url: place.url ?? '',
            memo: place.memo ?? '',
          }}
          onSubmit={handleSubmit}
          submitting={submitting}
          errors={errors}
          submitLabel="更新する"
        />
      )}
    </PageContainer>
  )
}
