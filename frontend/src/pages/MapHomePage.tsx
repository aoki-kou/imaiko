import { useState } from 'react'
import { JapanMap } from '../components/JapanMap'
import { PREFECTURES } from '../constants/prefectures'
import type { Region } from '../constants/regions'
import { RegionBar } from '../features/map/RegionBar'
import { usePlaces } from '../features/places/usePlaces'
import type { PlaceCounts } from '../features/places/usePlaces'
import { ShioriPanel } from '../features/shiori/ShioriPanel'
import { useSelectedPrefecture } from '../features/shiori/useSelectedPrefecture'

/**
 * 地図ホーム(/)。地図で都道府県を選ぶと、同じ画面の「しおり」パネルにその県の場所が表示される。
 * 選択中の都道府県は URL(/?prefecture=)で表す。ロゴ・ログアウトなどは共通ナビゲーション(AppLayout)にある
 */
export function MapHomePage() {
  const { places, counts, loadError, reload, removePlace } = usePlaces()
  const { selected, select, clear } = useSelectedPrefecture()
  // 地方での拡大は画面内の表示状態のため、URLには含めない
  const [zoomRegion, setZoomRegion] = useState<Region | null>(null)

  return (
    <main className="flex h-[calc(100dvh-3.5rem)] flex-col gap-2 overflow-hidden px-3 pt-2 md:grid md:h-dvh md:grid-cols-[minmax(0,1fr)_minmax(320px,392px)] md:gap-6 md:p-7 xl:gap-9 xl:px-9">
      <section aria-labelledby="map-home-title" className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h1
            id="map-home-title"
            className="text-[22px] leading-snug font-bold text-brand-primary md:text-[clamp(30px,3.2vw,46px)]"
          >
            いつかを、今日へ。
            <small className="mt-1 block font-brand text-[11px] font-medium tracking-[0.3em] text-brand-muted md:text-xs">
              イマイコ しおり
            </small>
          </h1>
          <MapCounter counts={counts} loaded={places !== null} />
        </div>

        {/* 地方を拡大したとき、地図が見出しや操作の上にはみ出さないよう表示領域で切り取る */}
        <div className="relative min-h-0 flex-1 overflow-hidden py-1">
          <JapanMap counts={counts} selected={selected} zoomRegion={zoomRegion} onSelectPrefecture={select} />
        </div>

        <RegionBar value={zoomRegion} onChange={setZoomRegion} />
        <p className="pb-1 text-center text-[10px] text-brand-muted md:text-right md:text-xs">
          地図データ: ©{' '}
          <a href="https://github.com/VictorCazanave/svg-maps" target="_blank" rel="noreferrer" className="underline">
            Victor Cazanave, svg-maps
          </a>
          ・
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="underline">
            CC BY 4.0
          </a>
        </p>
      </section>

      <ShioriPanel
        selected={selected}
        places={places}
        counts={counts}
        loadError={loadError}
        onReload={reload}
        onSelect={select}
        onClose={clear}
        onDelete={removePlace}
      />
    </main>
  )
}

/** 「朱に染まった県 n / 47」(場所を1件以上記した都道府県の数) */
function MapCounter({ counts, loaded }: { counts: PlaceCounts; loaded: boolean }) {
  const filled = PREFECTURES.filter((prefecture) => counts[prefecture] > 0).length

  return (
    <p className="flex-none text-right font-display text-xs leading-tight text-brand-muted md:text-sm">
      朱に染まった県
      <br />
      <b className="text-xl font-bold text-brand-accent-dark md:text-4xl">{loaded ? filled : '–'}</b>
      <span className="ml-1">/ {PREFECTURES.length}</span>
    </p>
  )
}
