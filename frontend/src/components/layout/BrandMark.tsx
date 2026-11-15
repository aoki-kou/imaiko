import { SealLogo } from '../ui/SealLogo'

type BrandMarkProps = {
  /** light: 和紙の上(上部バー) / dark: 藍の上(メニュー) */
  tone?: 'light' | 'dark'
}

/** スマホの上部バー・メニューに置く「印＋イマイコ / しおり」 */
export function BrandMark({ tone = 'light' }: BrandMarkProps) {
  const nameColor = tone === 'light' ? 'text-brand-primary' : 'text-white'
  const subColor = tone === 'light' ? 'text-brand-muted' : 'text-brand-gold'

  return (
    <span className="flex items-center gap-2.5">
      <SealLogo size="sm" />
      <span className="flex flex-col leading-tight">
        <span className={`font-display text-lg font-bold tracking-[0.12em] ${nameColor}`}>イマイコ</span>
        <span className={`text-[10px] font-medium tracking-[0.3em] ${subColor}`}>しおり</span>
      </span>
    </span>
  )
}
