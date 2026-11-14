import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
}

// 背景の和紙の質感は body(index.css)で描くため、ここでは塗りつぶさない
export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto w-full max-w-md">{children}</div>
    </main>
  )
}
