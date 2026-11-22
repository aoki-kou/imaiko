import type { ReactNode, RefObject } from 'react'
import { SHIORI_HEAD } from './shioriStyles'

type ShioriHeadProps = {
  eyebrow: string
  title: string
  headingRef?: RefObject<HTMLHeadingElement | null>
  children?: ReactNode
}

/**
 * しおりパネルの見出し。PCでは右端に縦書きで、スマホでは上に横書きで置く
 */
export function ShioriHead({ eyebrow, title, headingRef, children }: ShioriHeadProps) {
  return (
    <div className={`${SHIORI_HEAD} flex items-center gap-2.5 border-b-2 border-brand-primary pb-2.5 md:items-start md:border-b-0 md:pt-8 md:pb-0 md:[writing-mode:vertical-rl]`}>
      <p className="text-xs font-bold tracking-[0.4em] text-brand-muted">{eyebrow}</p>
      {/* 閉じたときなどにフォーカスを移せるよう tabIndex=-1 にする */}
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-[26px] font-bold tracking-[0.06em] text-brand-primary outline-none md:text-[34px] md:tracking-[0.12em]"
      >
        {title}
      </h2>
      {children}
    </div>
  )
}
