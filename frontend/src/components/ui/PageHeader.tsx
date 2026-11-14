import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type PageHeaderProps = {
  backTo: string
  backLabel: string
  title: string
  action?: ReactNode
}

export function PageHeader({ backTo, backLabel, title, action }: PageHeaderProps) {
  return (
    // 藍の二重線で、帳面の見出しのように区切る
    <div className="mb-6 flex items-end justify-between gap-4 border-b-[3px] border-double border-brand-primary pb-3">
      <div className="min-w-0">
        <Link to={backTo} className="text-sm text-brand-primary hover:underline">
          ← {backLabel}
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-brand-primary">{title}</h1>
      </div>
      {action}
    </div>
  )
}
