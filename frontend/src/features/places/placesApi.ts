export type Place = {
  id: number
  name: string
  prefecture: string
  url: string | null
  memo: string | null
  created_at: string
  updated_at: string
}

export type PlaceInput = {
  name: string
  prefecture: string
  url: string
  memo: string
}

export class PlacesApiError extends Error {
  status: number
  errors: string[]

  constructor(status: number, errors: string[]) {
    super(errors[0] ?? 'リクエストに失敗しました')
    this.status = status
    this.errors = errors
  }
}

type PlacesErrorPayload = {
  errors?: string[]
  error?: string
  message?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

function extractErrors(payload: PlacesErrorPayload): string[] {
  if (payload.errors?.length) return payload.errors
  if (payload.error) return [payload.error]
  if (payload.message) return [payload.message]
  return ['リクエストに失敗しました']
}

export async function fetchPlaces(token: string, prefecture: string): Promise<Place[]> {
  const query = new URLSearchParams({ prefecture }).toString()
  const res = await fetch(`${API_BASE_URL}/places?${query}`, {
    headers: { Authorization: token, Accept: 'application/json' },
  })

  const body = await res.json()

  if (!res.ok) {
    throw new PlacesApiError(res.status, extractErrors(body as PlacesErrorPayload))
  }

  return body as Place[]
}

export async function fetchPlace(token: string, id: number): Promise<Place> {
  const res = await fetch(`${API_BASE_URL}/places/${id}`, {
    headers: { Authorization: token, Accept: 'application/json' },
  })

  const body = await res.json()

  if (!res.ok) {
    throw new PlacesApiError(res.status, extractErrors(body as PlacesErrorPayload))
  }

  return body as Place
}

export async function createPlace(token: string, input: PlaceInput): Promise<Place> {
  const res = await fetch(`${API_BASE_URL}/places`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ place: input }),
  })

  const body = await res.json()

  if (!res.ok) {
    throw new PlacesApiError(res.status, extractErrors(body as PlacesErrorPayload))
  }

  return body as Place
}

export async function updatePlace(token: string, id: number, input: PlaceInput): Promise<Place> {
  const res = await fetch(`${API_BASE_URL}/places/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ place: input }),
  })

  const body = await res.json()

  if (!res.ok) {
    throw new PlacesApiError(res.status, extractErrors(body as PlacesErrorPayload))
  }

  return body as Place
}

export async function deletePlace(token: string, id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/places/${id}`, {
    method: 'DELETE',
    headers: { Authorization: token, Accept: 'application/json' },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new PlacesApiError(res.status, extractErrors(body as PlacesErrorPayload))
  }
}
