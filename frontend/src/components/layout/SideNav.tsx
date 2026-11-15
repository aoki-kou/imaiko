import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getCurrentNavKey, getVisibleNavGroups } from '../../constants/navigation'
import type { NavItem } from '../../constants/navigation'
import { NavIcon } from '../ui/NavIcon'
import { SealLogo } from '../ui/SealLogo'
import { NavUserSection } from './NavUserSection'
import { NAV_FOCUS_RING } from './navStyles'

/** PC(md以上)の藍色の縦書きサイドバー */
export function SideNav() {
  const { pathname } = useLocation()
  const currentKey = getCurrentNavKey(pathname)
  const groups = getVisibleNavGroups()

  return (
    <nav
      aria-label="メインメニュー"
      className="fixed inset-y-0 left-0 z-40 hidden w-24 flex-col items-center overflow-y-auto bg-brand-primary py-5 text-brand-on-primary [scrollbar-width:none] md:flex"
    >
      <Link to="/" className={`mb-3 rounded-lg p-1 ${NAV_FOCUS_RING}`}>
        <SealLogo size="md" />
        <span className="sr-only">イマイコ(地図へ)</span>
      </Link>

      <div className="flex flex-1 flex-col items-center">
        {groups.map((group, index) => (
          <Fragment key={group.label}>
            {index > 0 && <span aria-hidden="true" className="my-1 h-px w-[22px] bg-brand-gold/55" />}
            <ul aria-label={group.label} className="flex flex-col items-center">
              {group.items.map((item) => (
                <li key={item.key}>
                  <SideNavItem item={item} current={item.key === currentKey} />
                </li>
              ))}
            </ul>
          </Fragment>
        ))}
      </div>

      <NavUserSection variant="sidebar" />
    </nav>
  )
}

function SideNavItem({ item, current }: { item: NavItem; current: boolean }) {
  return (
    <Link
      to={item.to}
      aria-current={current ? 'page' : undefined}
      className={[
        'relative flex w-[72px] items-start justify-center gap-1.5 rounded-xl py-2.5 transition-colors',
        'hover:bg-white/7 hover:text-white',
        current ? 'text-white' : 'text-brand-on-primary-muted',
        NAV_FOCUS_RING,
      ].join(' ')}
    >
      {/* 現在地を示す朱の目印 */}
      {current && (
        <span
          aria-hidden="true"
          className="absolute top-1/2 -left-3 h-[26px] w-[5px] -translate-y-1/2 rounded-r bg-brand-accent"
        />
      )}
      {item.primary ? (
        <span className="-mt-[3px] grid size-[26px] -rotate-4 place-items-center rounded-md bg-brand-accent text-white">
          <NavIcon name={item.icon} className="size-4" />
        </span>
      ) : (
        <NavIcon name={item.icon} className="size-[18px]" />
      )}
      <span className="font-display text-[13px] leading-[1.3] font-bold tracking-[0.12em] [writing-mode:vertical-rl]">
        {item.label}
      </span>
    </Link>
  )
}
