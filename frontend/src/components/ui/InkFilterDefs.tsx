/** 印(SealLogo等)に朱肉のかすれを付けるSVGフィルターのID */
export const INK_FILTER_ID = 'imaiko-ink'

/**
 * 朱肉のかすれを表現するSVGフィルターの定義。アプリ全体で1回だけ描画する。
 * 描画負荷を抑えるため、ロゴや印など小さな要素にだけ適用する(地図には使わない)。
 */
export function InkFilterDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <filter id={INK_FILTER_ID}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={3} result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.2} />
      </filter>
    </svg>
  )
}
