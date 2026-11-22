const DIGITS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const UNITS = [
  { value: 1000, label: '千' },
  { value: 100, label: '百' },
  { value: 10, label: '十' },
]

/**
 * 件数などを漢数字で表す(例: 3 → 三、12 → 十二、105 → 百五)。
 * しおりの印・目次の見た目用。0や1万以上は算用数字のままにする
 */
export function toKanjiNumber(n: number): string {
  if (!Number.isInteger(n) || n <= 0 || n >= 10000) return String(n)

  let rest = n
  let result = ''
  for (const unit of UNITS) {
    const digit = Math.floor(rest / unit.value)
    if (digit > 0) {
      // 「一十」「一百」とは書かず「十」「百」とする
      result += (digit === 1 ? '' : DIGITS[digit]) + unit.label
      rest %= unit.value
    }
  }
  return result + DIGITS[rest]
}
