/**
 * しおりパネルの中の配置。
 * PC: 右端の列に縦書きの見出し、左の列に本文(上)と操作・注記(下)。スマホ: すべて縦に1列。
 */
export const SHIORI_LAYOUT =
  'grid grid-cols-1 md:min-h-full md:grid-cols-[minmax(0,1fr)_auto] md:grid-rows-[minmax(0,1fr)_auto] md:gap-x-4'
export const SHIORI_HEAD = 'md:col-start-2 md:row-span-2 md:row-start-1'
export const SHIORI_MAIN = 'pt-2 md:col-start-1 md:row-start-1 md:pt-8'
export const SHIORI_FOOT = 'pt-3 md:col-start-1 md:row-start-2 md:pt-4'
