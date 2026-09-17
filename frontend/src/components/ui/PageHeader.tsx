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
    <div className="mb-4 flex items-center justify-between">
      <div>
        <Link to={backTo} className="text-sm text-brand-primary hover:underline">
          ← {backLabel}
        </Link>
        <h1 className="mt-1 text-xl font-bold text-brand-text">{title}</h1>
      </div>
      {action}
    </div>
  )
}
