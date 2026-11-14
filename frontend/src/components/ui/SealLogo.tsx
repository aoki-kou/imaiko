import { INK_FILTER_ID } from './InkFilterDefs'

type SealLogoSize = 'sm' | 'md' | 'lg'

type SealLogoProps = {
  size?: SealLogoSize
}

const sizeClasses: Record<SealLogoSize, string> = {
  sm: 'size-9 rounded-md text-[11px]',
  md: 'size-12 rounded-lg text-sm',
  lg: 'size-20 rounded-xl text-2xl',
}

/**
 * 「イマ/イコ」を縦書きで刻んだ朱色の印。右の列から「イマ」→「イコ」と読む。
 * 装飾のため読み上げ対象外とし、ブランド名は隣に置くテキストやaria-labelで伝える。
 */
export function SealLogo({ size = 'md' }: SealLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={[
        'inline-grid flex-none -rotate-4 place-items-center bg-brand-accent text-brand-surface',
        'shadow-[inset_0_0_0_2px_var(--color-brand-accent),inset_0_0_0_3.5px_rgb(253_250_242/0.35)]',
        sizeClasses[size],
      ].join(' ')}
      style={{ filter: `url(#${INK_FILTER_ID})` }}
    >
      <span className="font-display leading-[1.05] font-bold tracking-[0.02em] [writing-mode:vertical-rl]">
        イマ
        <br />
        イコ
      </span>
    </span>
  )
}
