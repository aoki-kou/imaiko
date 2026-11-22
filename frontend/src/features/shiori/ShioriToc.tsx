import type { RefObject } from 'react'
import { PREFECTURES } from '../../constants/prefectures'
import type { Prefecture } from '../../constants/prefectures'
import { toKanjiNumber } from '../../utils/kanjiNumber'
import type { PlaceCounts } from '../places/usePlaces'
import { ShioriHead } from './ShioriHead'
import { SHIORI_FOOT, SHIORI_LAYOUT, SHIORI_MAIN } from './shioriStyles'

type ShioriTocProps = {
  counts: PlaceCounts
  onSelect: (prefecture: Prefecture) => void
  headingRef: RefObject<HTMLHeadingElement | null>
}

/** 都道府県を選んでいないときの「しおり」：保存済みの県を件数の多い順に並べた目次 */
export function ShioriToc({ counts, onSelect, headingRef }: ShioriTocProps) {
  const saved = PREFECTURES.filter((prefecture) => counts[prefecture] > 0).sort(
    (a, b) => counts[b] - counts[a],
  )

  return (
    <div className={SHIORI_LAYOUT}>
      <ShioriHead eyebrow="しおり" title="目次" headingRef={headingRef} />
      <div className={SHIORI_MAIN}>
        {saved.length > 0 ? (
          <ol aria-label="場所を記した都道府県">
            {saved.map((prefecture) => (
              <li key={prefecture}>
                <button
                  type="button"
                  onClick={() => onSelect(prefecture)}
                  className="group flex w-full items-baseline gap-2 rounded py-2.5 text-left focus-visible:outline-2 focus-visible:outline-brand-primary"
                >
                  <span className="text-[17px] font-bold text-brand-primary group-hover:text-brand-accent-dark">
                    {prefecture}
                  </span>
                  <span aria-hidden="true" className="flex-1 -translate-y-1 border-b border-dotted border-brand-border-strong" />
                  <span className="font-display font-bold text-brand-accent-dark">
                    <span aria-hidden="true">{toKanjiNumber(counts[prefecture])}</span>
                    <span className="sr-only">{counts[prefecture]}件</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="font-display text-[15px] leading-loose text-brand-muted">
            まだ白紙のしおりです。
            <br />
            地図から都道府県を選んで、最初の一か所を記しましょう。
          </p>
        )}
      </div>
      <p className={`${SHIORI_FOOT} text-xs leading-relaxed text-brand-muted`}>
        地図の都道府県を選ぶと、その頁がひらきます。
        <br />
        保存するたびに、地図が朱に染まっていきます。
      </p>
    </div>
  )
}
