type LogoProps = {
  tagline?: boolean
}

export function Logo({ tagline = false }: LogoProps) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold tracking-wide text-brand-text">
        イマ<span className="text-brand-primary">→</span>イコ
      </p>
      {tagline && <p className="mt-1 text-sm text-brand-muted">いつか行きたいを、今日行こうに変える。</p>}
    </div>
  )
}
