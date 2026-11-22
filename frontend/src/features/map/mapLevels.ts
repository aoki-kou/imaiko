/**
 * 保存件数に応じた地図の塗り分け(朱の濃淡5段階)。
 * 0件 / 1件 / 2件 / 3〜4件 / 5件以上。色の値は index.css の @theme(--color-map-level-*)で定義する。
 */
export function mapLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count <= 4) return 3
  return 4
}

// Tailwindがクラス名を検出できるよう、完全なクラス名で書く
export const MAP_LEVEL_FILL_CLASS = [
  'fill-map-level-0 stroke-map-border',
  'fill-map-level-1 stroke-map-border-filled',
  'fill-map-level-2 stroke-map-border-filled',
  'fill-map-level-3 stroke-map-border-filled',
  'fill-map-level-4 stroke-map-border-filled',
] as const
