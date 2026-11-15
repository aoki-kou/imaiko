import type { NavIconName } from '../../constants/navigation'

export type IconName = NavIconName | 'close' | 'logout' | 'privacy'

const ICON_PATHS: Record<IconName, string[]> = {
  map: ['M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z', 'M9 4v14M15 6v14'],
  pin: ['M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z', 'M14.5 9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z'],
  plus: ['M12 5v14M5 12h14'],
  stamp: ['M9.5 3h5v5.5l3 2.5h-11l3-2.5V3Z', 'M5 14h14v3H5zM7 20.5h10'],
  user: ['M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z', 'M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6'],
  gear: [
    'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    'M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1',
  ],
  close: ['M6 6l12 12M18 6 6 18'],
  logout: ['M9 4H5v16h4', 'M14 8l4 4-4 4M18 12H9'],
  privacy: ['M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z', 'M9.5 12l2 2 3.5-4'],
}

type NavIconProps = {
  name: IconName
  className?: string
}

/** 線画のアイコン。装飾のため読み上げ対象外とし、意味は隣のテキストやaria-labelで伝える */
export function NavIcon({ name, className = 'size-5' }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {ICON_PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
