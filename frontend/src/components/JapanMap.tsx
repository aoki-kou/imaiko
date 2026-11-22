import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import rawMapData from '@svg-maps/japan'
import type { Prefecture } from '../constants/prefectures'
import { PREFECTURE_ID_TO_NAME } from '../constants/prefectureMap'
import { PREFECTURE_TO_REGION } from '../constants/regions'
import type { Region } from '../constants/regions'
import { MAP_LEVEL_FILL_CLASS, mapLevel } from '../features/map/mapLevels'
import type { PlaceCounts } from '../features/places/usePlaces'

type JapanMapProps = {
  counts: PlaceCounts
  selected: Prefecture | null
  /** 拡大表示する地方(null は全国) */
  zoomRegion: Region | null
  onSelectPrefecture: (prefecture: Prefecture) => void
}

/**
 * @svg-maps/japan の型定義は未公開パッケージ(svg-maps__common)を参照しており解決できないため、
 * 実データの構造(公式READMEのMap形式)に基づきこちらで型を明示する。
 */
type SvgMapLocation = {
  id: string
  name: string
  path: string
}

type SvgMap = {
  viewBox: string
  label: string
  locations: SvgMapLocation[]
}

type ViewBox = [number, number, number, number]

const mapData = rawMapData as unknown as SvgMap
const BASE_VIEW_BOX = mapData.viewBox.split(' ').map(Number) as ViewBox
const ZOOM_DURATION_MS = 520

const LOCATIONS = mapData.locations.flatMap((location) => {
  const prefecture = PREFECTURE_ID_TO_NAME[location.id]
  return prefecture ? [{ ...location, prefecture }] : []
})

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** 地方に属する都道府県の形状をすべて含む範囲(余白つき)を求める */
function regionViewBox(region: Region, paths: Map<Prefecture, SVGPathElement>): ViewBox {
  const boxes = LOCATIONS.filter(
    // 沖縄は本土から離れているため、九州・沖縄を拡大するときは含めない(含めると九州が小さくなる)
    ({ prefecture }) => PREFECTURE_TO_REGION[prefecture] === region && prefecture !== '沖縄県',
  ).flatMap(({ prefecture }) => {
    const path = paths.get(prefecture)
    return path ? [path.getBBox()] : []
  })
  if (boxes.length === 0) return BASE_VIEW_BOX

  const x1 = Math.min(...boxes.map((b) => b.x))
  const y1 = Math.min(...boxes.map((b) => b.y))
  const x2 = Math.max(...boxes.map((b) => b.x + b.width))
  const y2 = Math.max(...boxes.map((b) => b.y + b.height))
  const pad = Math.max(x2 - x1, y2 - y1) * 0.18
  return [x1 - pad, y1 - pad, x2 - x1 + pad * 2, y2 - y1 + pad * 2]
}

/**
 * 都道府県の日本地図。
 * 地図データ(@svg-maps/japan)は CC BY 4.0 のため、この地図を表示する画面には必ずクレジット表記
 * (Victor Cazanave, svg-maps へのリンクと CC BY 4.0 へのリンク)を置くこと。現在は MapHomePage の地図の下に表示している
 */
export function JapanMap({ counts, selected, zoomRegion, onSelectPrefecture }: JapanMapProps) {
  const titleId = useId()
  const svgRef = useRef<SVGSVGElement>(null)
  const pathsRef = useRef(new Map<Prefecture, SVGPathElement>())
  const currentViewBox = useRef<ViewBox>(BASE_VIEW_BOX)
  // キーボード操作でフォーカスしている県(輪郭線を重ねて示す)
  const [focused, setFocused] = useState<Prefecture | null>(null)

  // 地方での拡大は viewBox を書き換えて行う(URLは変えない)。
  // 毎フレームReactの再描画を起こさないよう、属性を直接更新する(JSX側の viewBox は変化しない初期値のみ)
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const target = zoomRegion ? regionViewBox(zoomRegion, pathsRef.current) : BASE_VIEW_BOX
    const apply = (viewBox: ViewBox) => {
      currentViewBox.current = viewBox
      svg.setAttribute('viewBox', viewBox.map((v) => v.toFixed(2)).join(' '))
    }

    if (prefersReducedMotion()) {
      apply(target)
      return
    }

    const from = currentViewBox.current
    const start = performance.now()
    let frame = 0
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / ZOOM_DURATION_MS)
      const eased = 1 - (1 - progress) ** 3
      apply(from.map((v, i) => v + (target[i] - v) * eased) as ViewBox)
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [zoomRegion])

  function handleKeyDown(event: KeyboardEvent<SVGPathElement>, prefecture: Prefecture) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectPrefecture(prefecture)
    }
  }

  const selectedLocation = selected ? LOCATIONS.find((location) => location.prefecture === selected) : undefined
  const focusedLocation = focused ? LOCATIONS.find((location) => location.prefecture === focused) : undefined

  return (
    <svg
      ref={svgRef}
      viewBox={mapData.viewBox}
      role="group"
      aria-labelledby={titleId}
      className="size-full drop-shadow-[0_1px_0_rgb(255_255_255/0.6)]"
    >
      <title id={titleId}>日本地図(都道府県を選ぶと、その県のしおりが開きます)</title>
      {LOCATIONS.map(({ id, path, prefecture }) => {
        const count = counts[prefecture]
        const isSelected = prefecture === selected
        return (
          <path
            key={id}
            ref={(element) => {
              if (element) pathsRef.current.set(prefecture, element)
              else pathsRef.current.delete(prefecture)
            }}
            d={path}
            role="button"
            tabIndex={0}
            aria-label={`${prefecture}(${count}件)`}
            aria-pressed={isSelected}
            onClick={() => onSelectPrefecture(prefecture)}
            onKeyDown={(event) => handleKeyDown(event, prefecture)}
            // キーボード操作でフォーカスしたときだけ(マウスのクリックでは出さない)、県の輪郭線でフォーカス位置を示す
            onFocus={(event) => setFocused(event.currentTarget.matches(':focus-visible') ? prefecture : null)}
            onBlur={() => setFocused(null)}
            className={[
              MAP_LEVEL_FILL_CLASS[mapLevel(count)],
              // 拡大しても県境の線の太さが変わらないよう、線幅は画面上のピクセルで指定する。
              // ブラウザ標準の四角いフォーカス枠は出さず、下の輪郭線の重ね描きで示す
              'cursor-pointer stroke-[0.8] outline-hidden transition-[filter] [vector-effect:non-scaling-stroke]',
              'hover:brightness-90',
            ].join(' ')}
          >
            <title>{`${prefecture} ${count > 0 ? `${count}件` : '未保存'}`}</title>
          </path>
        )
      })}
      {/*
        選択中の県を最前面に重ねて描き、枠線が隣の県に隠れないようにする。
        元の<path>の並び順を変えるとキーボードのフォーカスが外れるため、操作できない複製を重ねる
      */}
      {selectedLocation && (
        <path
          d={selectedLocation.path}
          aria-hidden="true"
          className="pointer-events-none fill-brand-primary stroke-brand-surface stroke-[1.6] [vector-effect:non-scaling-stroke] drop-shadow-[0_2px_4px_rgb(20_28_63/0.35)]"
        />
      )}
      {/*
        キーボードのフォーカス位置：塗りは変えず、県の輪郭に沿って「白い縁取り＋墨色の線」を重ねる。
        選択(藍の塗り)とは見た目が異なり、選択中の県にフォーカスがあるときも両方が分かる
      */}
      {focusedLocation && (
        <g aria-hidden="true" className="pointer-events-none fill-none [&>path]:[vector-effect:non-scaling-stroke]">
          <path d={focusedLocation.path} className="stroke-brand-surface stroke-[5] [stroke-linejoin:round]" />
          <path d={focusedLocation.path} className="stroke-brand-text stroke-[2.25] [stroke-linejoin:round]" />
        </g>
      )}
    </svg>
  )
}
