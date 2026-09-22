import type { Prefecture } from './prefectures'

export const REGIONS = ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州・沖縄'] as const

export type Region = (typeof REGIONS)[number]

/** 都道府県(日本語表記)から地方区分への対応表。 */
export const PREFECTURE_TO_REGION: Record<Prefecture, Region> = {
  北海道: '北海道',

  青森県: '東北',
  岩手県: '東北',
  宮城県: '東北',
  秋田県: '東北',
  山形県: '東北',
  福島県: '東北',

  茨城県: '関東',
  栃木県: '関東',
  群馬県: '関東',
  埼玉県: '関東',
  千葉県: '関東',
  東京都: '関東',
  神奈川県: '関東',

  新潟県: '中部',
  富山県: '中部',
  石川県: '中部',
  福井県: '中部',
  山梨県: '中部',
  長野県: '中部',
  岐阜県: '中部',
  静岡県: '中部',
  愛知県: '中部',

  三重県: '近畿',
  滋賀県: '近畿',
  京都府: '近畿',
  大阪府: '近畿',
  兵庫県: '近畿',
  奈良県: '近畿',
  和歌山県: '近畿',

  鳥取県: '中国',
  島根県: '中国',
  岡山県: '中国',
  広島県: '中国',
  山口県: '中国',

  徳島県: '四国',
  香川県: '四国',
  愛媛県: '四国',
  高知県: '四国',

  福岡県: '九州・沖縄',
  佐賀県: '九州・沖縄',
  長崎県: '九州・沖縄',
  熊本県: '九州・沖縄',
  大分県: '九州・沖縄',
  宮崎県: '九州・沖縄',
  鹿児島県: '九州・沖縄',
  沖縄県: '九州・沖縄',
}

/**
 * 地方区分ごとの塗りつぶしクラス。色の値は index.css の @theme (--color-region-*) で定義する。
 */
export const REGION_FILL_CLASS: Record<Region, string> = {
  北海道: 'fill-region-hokkaido',
  東北: 'fill-region-tohoku',
  関東: 'fill-region-kanto',
  中部: 'fill-region-chubu',
  近畿: 'fill-region-kinki',
  中国: 'fill-region-chugoku',
  四国: 'fill-region-shikoku',
  '九州・沖縄': 'fill-region-kyushu-okinawa',
}
