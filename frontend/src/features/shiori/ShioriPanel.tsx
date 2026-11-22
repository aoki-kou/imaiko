import { useEffect, useRef, useState } from 'react'
import { NavIcon } from '../../components/ui/NavIcon'
import type { Prefecture } from '../../constants/prefectures'
import type { Place } from '../places/placesApi'
import type { PlaceCounts } from '../places/usePlaces'
import { ShioriPrefecture } from './ShioriPrefecture'
import { ShioriToc } from './ShioriToc'

/** スマホのボトムシートの高さ(たたむ・半分・全体の3段階) */
type SheetState = 'collapsed' | 'half' | 'full'

const SHEET_ORDER: SheetState[] = ['collapsed', 'half', 'full']

// スマホ(md未満)だけに適用する高さ。親(地図ホームの縦並び)の高さに対する割合で、残りに地図が表示される
const SHEET_HEIGHT_CLASS: Record<SheetState, string> = {
  collapsed: 'max-md:h-[7.5rem]',
  half: 'max-md:h-[52%]',
  full: 'max-md:h-[88%]',
}

const CONTROL_BUTTON_CLASS =
  'grid size-9 place-items-center rounded-full text-brand-muted hover:bg-brand-bg hover:text-brand-primary disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-brand-primary'

type ShioriPanelProps = {
  selected: Prefecture | null
  places: Place[] | null
  counts: PlaceCounts
  loadError: string | null
  onReload: () => void
  onSelect: (prefecture: Prefecture) => void
  onClose: () => void
  onDelete: (id: number) => Promise<void>
}

/**
 * 地図ホームの「しおり」パネル。
 * PCは地図の右に並べる(地図と重ねない)。スマホは地図の下のボトムシートで、高さを3段階に切り替えられる。
 * どちらもモーダルではないため、表示中も地図を操作できる。
 */
export function ShioriPanel({
  selected,
  places,
  counts,
  loadError,
  onReload,
  onSelect,
  onClose,
  onDelete,
}: ShioriPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  // 閉じるボタン・目次の項目はクリック後に消えるため、次の描画で見出しへフォーカスを移す
  const focusHeadingRef = useRef(false)

  const [sheet, setSheet] = useState<SheetState>(selected ? 'half' : 'collapsed')
  // 県を選んだとき、シートがたたまれていれば半分まで開く(前回の描画時の選択と比べて描画中に更新する)
  const [previousSelected, setPreviousSelected] = useState(selected)
  if (previousSelected !== selected) {
    setPreviousSelected(selected)
    if (selected && sheet === 'collapsed') setSheet('half')
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
    if (focusHeadingRef.current) {
      focusHeadingRef.current = false
      headingRef.current?.focus()
    }
  }, [selected])

  const sheetIndex = SHEET_ORDER.indexOf(sheet)
  const placesOfSelected = selected && places ? places.filter((place) => place.prefecture === selected) : []

  function handleClose() {
    focusHeadingRef.current = true
    onClose()
  }

  function handleSelectFromToc(prefecture: Prefecture) {
    focusHeadingRef.current = true
    onSelect(prefecture)
  }

  let content
  if (loadError) {
    content = (
      <div className="pt-10">
        <p role="alert" className="rounded-sm bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {loadError}
        </p>
        <button
          type="button"
          onClick={onReload}
          className="mt-3 text-sm font-bold text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary"
        >
          もう一度読み込む
        </button>
      </div>
    )
  } else if (places === null) {
    content = <p className="pt-10 text-brand-muted">読み込み中です</p>
  } else if (selected) {
    content = (
      <ShioriPrefecture
        prefecture={selected}
        places={placesOfSelected}
        onDelete={onDelete}
        headingRef={headingRef}
      />
    )
  } else {
    content = <ShioriToc counts={counts} onSelect={handleSelectFromToc} headingRef={headingRef} />
  }

  return (
    <aside
      aria-label="しおり"
      className={[
        'relative flex min-h-0 flex-none flex-col border border-brand-border bg-brand-surface',
        'shadow-[0_1px_0_#fff_inset,0_18px_40px_rgb(40_30_10/0.12),0_2px_6px_rgb(40_30_10/0.06)]',
        'max-md:-mx-3 max-md:rounded-t max-md:border-b-0 max-md:transition-[height] max-md:duration-300 motion-reduce:transition-none',
        'md:h-full md:rounded-[3px]',
        SHEET_HEIGHT_CLASS[sheet],
      ].join(' ')}
    >
      {/* 選択の変化を読み上げる(地図を操作したままでも、パネルが切り替わったことが分かるように) */}
      <p className="sr-only" aria-live="polite">
        {selected && places ? `${selected}のしおり。${placesOfSelected.length}件` : ''}
      </p>

      {/* スマホ：シートの高さを切り替えるボタン(ドラッグ操作はなし) */}
      <div className="relative flex h-11 flex-none items-center gap-1 px-2 md:hidden">
        <button
          type="button"
          onClick={() => setSheet(SHEET_ORDER[sheetIndex + 1])}
          disabled={sheetIndex === SHEET_ORDER.length - 1}
          aria-label="しおりを広げる"
          className={CONTROL_BUTTON_CLASS}
        >
          <NavIcon name="chevron-up" className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => setSheet(SHEET_ORDER[sheetIndex - 1])}
          disabled={sheetIndex === 0}
          aria-label="しおりをたたむ"
          className={CONTROL_BUTTON_CLASS}
        >
          <NavIcon name="chevron-down" className="size-5" />
        </button>
        <span aria-hidden="true" className="absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-brand-border-strong" />
      </div>

      {selected && (
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-1 right-2 z-10 grid size-9 place-items-center rounded-full text-brand-muted hover:bg-brand-bg hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-brand-primary md:top-3 md:right-auto md:left-3"
        >
          <NavIcon name="close" className="size-5" />
          <span className="sr-only">{selected}のしおりを閉じる</span>
        </button>
      )}

      {/* PC：しおりの紐を思わせる朱の二重線 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[18px] right-3 bottom-[18px] hidden w-1 border-x border-brand-accent opacity-55 md:block"
      />

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-[18px] pb-6 md:pt-5 md:pr-[30px] md:pb-[22px] md:pl-[22px]">
        {content}
      </div>
    </aside>
  )
}
