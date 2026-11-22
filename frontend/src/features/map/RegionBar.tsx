import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { REGIONS } from '../../constants/regions'
import type { Region } from '../../constants/regions'
import { NavIcon } from '../../components/ui/NavIcon'

type RegionBarProps = {
  value: Region | null
  onChange: (region: Region | null) => void
}

const OPTIONS: { label: string; region: Region | null }[] = [
  { label: '全国', region: null },
  ...REGIONS.map((region) => ({ label: region, region })),
]

const ARROW_CLASS =
  'grid size-8 flex-none place-items-center rounded-full text-brand-primary transition-opacity hover:bg-brand-primary-light disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-2 focus-visible:outline-brand-primary'

/**
 * 地方で拡大するボタン列。狭い画面では横にスクロールでき、左右の矢印ボタンでも移動できる。
 * 選択中の地方は常に見える位置へ寄せる
 */
export function RegionBar({ value, onChange }: RegionBarProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const [canScroll, setCanScroll] = useState({ left: false, right: false })

  const updateScrollState = useCallback(() => {
    const list = listRef.current
    if (!list) return
    const max = list.scrollWidth - list.clientWidth
    setCanScroll({ left: list.scrollLeft > 2, right: list.scrollLeft < max - 2 })
  }, [])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    updateScrollState()
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(list)
    return () => observer.disconnect()
  }, [updateScrollState])

  function scrollByStep(direction: 1 | -1) {
    const list = listRef.current
    if (!list) return
    list.scrollBy({ left: direction * Math.max(120, list.clientWidth * 0.7), behavior: 'smooth' })
  }

  function reveal(button: HTMLElement) {
    const list = listRef.current
    if (!list) return
    const left = button.offsetLeft - (list.clientWidth - button.offsetWidth) / 2
    list.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }

  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => scrollByStep(-1)}
        disabled={!canScroll.left}
        aria-label="前の地方を表示"
        className={ARROW_CLASS}
      >
        <NavIcon name="chevron-left" className="size-4" />
      </button>
      <div
        ref={listRef}
        role="group"
        aria-label="地方で拡大"
        onScroll={updateScrollState}
        className="flex min-w-0 flex-1 snap-x snap-proximity items-center overflow-x-auto overscroll-x-contain px-0.5 pt-0.5 pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {OPTIONS.map((option, index) => {
          const pressed = option.region === value
          return (
            <Fragment key={option.label}>
              {index > 0 && <span aria-hidden="true" className="mx-1.5 h-3 w-px flex-none bg-brand-border-strong" />}
              <button
                type="button"
                aria-pressed={pressed}
                onClick={(event) => {
                  onChange(option.region)
                  reveal(event.currentTarget)
                }}
                onFocus={(event) => reveal(event.currentTarget)}
                className={[
                  'relative flex-none snap-center rounded px-1.5 py-1.5 font-display text-sm font-bold tracking-[0.06em] whitespace-nowrap',
                  'focus-visible:outline-2 focus-visible:outline-brand-primary',
                  pressed ? 'text-brand-primary' : 'text-brand-muted hover:text-brand-primary',
                ].join(' ')}
              >
                {option.label}
                {/* 選択中の地方を示す朱の点 */}
                {pressed && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-brand-accent"
                  />
                )}
              </button>
            </Fragment>
          )
        })}
      </div>
      <button
        type="button"
        onClick={() => scrollByStep(1)}
        disabled={!canScroll.right}
        aria-label="次の地方を表示"
        className={ARROW_CLASS}
      >
        <NavIcon name="chevron-right" className="size-4" />
      </button>
    </div>
  )
}
