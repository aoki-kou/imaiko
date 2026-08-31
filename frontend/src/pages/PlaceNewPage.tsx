import { useState } from 'react'
import { Link, createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import { PlaceForm } from '../features/places/PlaceForm'
import { PlacesApiError, createPlace } from '../features/places/placesApi'
import type { PlaceInput } from '../features/places/placesApi'

export function PlaceNewPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialPrefecture = searchParams.get('prefecture') ?? ''

  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(input: PlaceInput) {
    if (!token) return

    setErrors([])
    setSubmitting(true)
    try {
      const place = await createPlace(token, input)
      navigate(`/places?${createSearchParams({ prefecture: place.prefecture })}`)
    } catch (err) {
      setErrors(err instanceof PlacesApiError ? err.errors : ['場所の登録に失敗しました'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <p>
        <Link to="/">都道府県選択に戻る</Link>
      </p>
      <h1>場所の新規登録</h1>
      <PlaceForm
        initialValues={{ name: '', prefecture: initialPrefecture, url: '', memo: '' }}
        onSubmit={handleSubmit}
        submitting={submitting}
        errors={errors}
        submitLabel="登録する"
      />
    </main>
  )
}
