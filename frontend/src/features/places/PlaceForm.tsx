import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PREFECTURES } from '../../constants/prefectures'
import type { PlaceInput } from './placesApi'

type PlaceFormProps = {
  initialValues: PlaceInput
  onSubmit: (input: PlaceInput) => void | Promise<void>
  submitting: boolean
  errors: string[]
  submitLabel: string
}

export function PlaceForm({ initialValues, onSubmit, submitting, errors, submitLabel }: PlaceFormProps) {
  const [name, setName] = useState(initialValues.name)
  const [prefecture, setPrefecture] = useState(initialValues.prefecture)
  const [url, setUrl] = useState(initialValues.url)
  const [memo, setMemo] = useState(initialValues.memo)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({ name, prefecture, url, memo })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input id="place-name" label="場所名" value={name} onChange={(e) => setName(e.target.value)} required />
      <div>
        <label htmlFor="place-prefecture">都道府県</label>
        <select
          id="place-prefecture"
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
          required
        >
          <option value="" disabled>
            選択してください
          </option>
          {PREFECTURES.map((pref) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </select>
      </div>
      <Input
        id="place-url"
        label="参照URL"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://"
      />
      <div>
        <label htmlFor="place-memo">メモ</label>
        <textarea id="place-memo" value={memo} onChange={(e) => setMemo(e.target.value)} />
      </div>
      {errors.length > 0 && (
        <ul>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <Button type="submit" disabled={submitting}>
        {submitLabel}
      </Button>
    </form>
  )
}
