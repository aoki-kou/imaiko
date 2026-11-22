import { useState } from 'react'
import type { RefObject } from 'react'
import { Link, createSearchParams } from 'react-router-dom'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { NavIcon } from '../../components/ui/NavIcon'
import type { Prefecture } from '../../constants/prefectures'
import { PREFECTURE_TO_REGION } from '../../constants/regions'
import { toKanjiNumber } from '../../utils/kanjiNumber'
import { PlacesApiError } from '../places/placesApi'
import type { Place } from '../places/placesApi'
import { ShioriHead } from './ShioriHead'
import { SHIORI_FOOT, SHIORI_LAYOUT, SHIORI_MAIN } from './shioriStyles'

type ShioriPrefectureProps = {
  prefecture: Prefecture
  places: Place[]
  onDelete: (id: number) => Promise<void>
  headingRef: RefObject<HTMLHeadingElement | null>
}

function displayHost(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

/** 選択した都道府県の「しおり」：保存した場所の一覧と、登録・編集・削除への導線 */
export function ShioriPrefecture({ prefecture, places, onDelete, headingRef }: ShioriPrefectureProps) {
  const [pendingDelete, setPendingDelete] = useState<Place | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  // 別の県へ切り替えたら、前の県の削除エラーは消す(前回の描画時の県と比べて描画中に更新する)
  const [errorPrefecture, setErrorPrefecture] = useState(prefecture)
  if (errorPrefecture !== prefecture) {
    setErrorPrefecture(prefecture)
    setDeleteError(null)
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await onDelete(pendingDelete.id)
    } catch (err) {
      setDeleteError(err instanceof PlacesApiError ? err.errors[0] : '場所の削除に失敗しました')
    } finally {
      setDeleting(false)
      setPendingDelete(null)
    }
  }

  const count = places.length

  return (
    <div className={SHIORI_LAYOUT}>
      <ShioriHead eyebrow={PREFECTURE_TO_REGION[prefecture]} title={prefecture} headingRef={headingRef}>
        {count > 0 && (
          // 件数の印(朱肉のかすれはロゴ・印などの小さな要素だけに使う)
          <span className="ml-auto inline-grid size-11 -rotate-8 place-items-center rounded-full border-2 border-brand-accent font-display text-base leading-none font-bold text-brand-accent-dark [filter:url(#ink)] [writing-mode:horizontal-tb] md:mt-3 md:ml-0 md:size-[50px] md:text-lg">
            <span aria-hidden="true" className="flex flex-col items-center">
              {toKanjiNumber(count)}
              <small className="text-[9px] tracking-[0.1em]">件</small>
            </span>
            <span className="sr-only">{count}件</span>
          </span>
        )}
      </ShioriHead>

      <div className={SHIORI_MAIN}>
        {deleteError && (
          <p role="alert" className="mb-3 rounded-sm bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
            {deleteError}
          </p>
        )}

        {count > 0 ? (
          <ol aria-label={`${prefecture}に記した場所`}>
            {places.map((place, index) => (
              <li key={place.id} className="flex gap-3 border-b border-brand-border py-3.5">
                <span aria-hidden="true" className="min-w-[1.4em] pt-0.5 font-display text-[13px] font-bold text-brand-accent-dark">
                  {toKanjiNumber(index + 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[17px] font-bold break-words text-brand-primary">{place.name}</h3>
                  {place.memo && (
                    <p className="mt-1 text-[13px] leading-relaxed break-words whitespace-pre-wrap text-brand-muted">
                      {place.memo}
                    </p>
                  )}
                  {place.url && (
                    <a
                      href={place.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1.5 inline-flex max-w-full items-center gap-1 border-b border-brand-border-strong text-xs text-brand-primary hover:text-brand-primary-hover"
                    >
                      <NavIcon name="external" className="size-3.5 flex-none" />
                      <span className="truncate">{displayHost(place.url)}</span>
                      <span className="sr-only">(新しいタブで開く)</span>
                    </a>
                  )}
                  <div className="mt-2.5 flex items-center gap-4 text-sm">
                    <Link
                      to={`/places/${place.id}/edit`}
                      className="inline-flex items-center gap-1 rounded text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary"
                    >
                      <NavIcon name="edit" className="size-4" />
                      編集
                      <span className="sr-only">({place.name})</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(place)}
                      className="rounded text-brand-danger hover:underline focus-visible:outline-2 focus-visible:outline-brand-danger"
                    >
                      削除
                      <span className="sr-only">({place.name})</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="pt-3 font-display text-[15px] leading-loose text-brand-muted">
            この頁は、まだ白紙です。
            <br />
            最初の一か所を記しましょう。
          </p>
        )}
      </div>

      <div className={SHIORI_FOOT}>
        <Link
          to={{ pathname: '/places/new', search: createSearchParams({ prefecture }).toString() }}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-primary font-bold tracking-[0.08em] text-brand-surface shadow-[0_2px_0_var(--color-brand-primary-deep)] hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          <NavIcon name="plus" className="size-5 text-[#ffb4a3]" />
          この県に記す
        </Link>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="場所を削除しますか？"
        message={pendingDelete ? `「${pendingDelete.name}」をしおりから削除します。この操作は取り消せません。` : ''}
        confirmLabel="削除する"
        busy={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
        fallbackFocusRef={headingRef}
      />
    </div>
  )
}
