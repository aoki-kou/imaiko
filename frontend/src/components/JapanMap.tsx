import { useId, type KeyboardEvent } from 'react'
import rawMapData from '@svg-maps/japan'
import type { Prefecture } from '../constants/prefectures'
import { PREFECTURE_ID_TO_NAME } from '../constants/prefectureMap'
import { PREFECTURE_TO_REGION, REGION_FILL_CLASS } from '../constants/regions'

type JapanMapProps = {
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

const mapData = rawMapData as unknown as SvgMap

export function JapanMap({ onSelectPrefecture }: JapanMapProps) {
  const titleId = useId()

  function handleKeyDown(event: KeyboardEvent<SVGPathElement>, prefecture: Prefecture) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectPrefecture(prefecture)
    }
  }

  return (
    <div>
      <svg viewBox={mapData.viewBox} role="group" aria-labelledby={titleId} className="h-auto w-full">
        <title id={titleId}>日本地図(都道府県選択)</title>
        {mapData.locations.map((location) => {
          const prefecture = PREFECTURE_ID_TO_NAME[location.id]
          if (!prefecture) {
            return null
          }
          const region = PREFECTURE_TO_REGION[prefecture]
          return (
            <path
              key={location.id}
              d={location.path}
              role="button"
              tabIndex={0}
              aria-label={prefecture}
              onClick={() => onSelectPrefecture(prefecture)}
              onKeyDown={(event) => handleKeyDown(event, prefecture)}
              className={[
                REGION_FILL_CLASS[region],
                'cursor-pointer stroke-brand-surface stroke-[0.5] outline-none transition-opacity',
                'hover:opacity-80',
                'focus-visible:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-text',
              ].join(' ')}
            />
          )
        })}
      </svg>
      <p className="mt-2 text-center text-xs text-brand-muted">
        地図データ: ©{' '}
        <a
          href="https://github.com/VictorCazanave/svg-maps"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Victor Cazanave, svg-maps
        </a>
        ・
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="underline">
          CC BY 4.0
        </a>
      </p>
    </div>
  )
}
