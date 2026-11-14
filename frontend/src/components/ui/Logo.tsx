import { SealLogo } from './SealLogo'

type LogoProps = {
  /** キャッチコピーを表示する(縦並びのときのみ) */
  tagline?: boolean
  /** stacked: 印を上に大きく置く(ログイン・スプラッシュ等) / inline: 印と名前を横に並べる(ヘッダー等) */
  layout?: 'stacked' | 'inline'
}

export function Logo({ tagline = false, layout = 'stacked' }: LogoProps) {
  if (layout === 'inline') {
    return (
      <div className="flex items-center gap-3">
        <SealLogo size="sm" />
        <p className="font-display text-xl font-bold tracking-[0.12em] text-brand-primary">イマイコ</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center text-center">
      <SealLogo size="lg" />
      <p className="mt-4 font-display text-3xl font-bold tracking-[0.2em] text-brand-primary">イマイコ</p>
      {tagline && <p className="mt-2 text-sm text-brand-muted">いつか行きたいを、今日行こうに変える。</p>}
    </div>
  )
}
