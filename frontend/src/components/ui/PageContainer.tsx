import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="min-h-screen bg-brand-bg px-4 py-8">
      <div className="mx-auto w-full max-w-md">{children}</div>
    </main>
  )
}
