import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { FormErrors } from '../../components/ui/FormErrors'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input id="place-name" label="場所名" value={name} onChange={(e) => setName(e.target.value)} required />
      <Select
        id="place-prefecture"
        label="都道府県"
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
      </Select>
      <Input
        id="place-url"
        label="参照URL"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://"
      />
      <Textarea id="place-memo" label="メモ" value={memo} onChange={(e) => setMemo(e.target.value)} rows={4} />
      <FormErrors errors={errors} />
      <Button type="submit" disabled={submitting} className="w-full">
        {submitLabel}
      </Button>
    </form>
  )
}
