import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
}

// 背景の和紙の質感は body(index.css)で描くため、ここでは塗りつぶさない。
// 高さは中身に合わせる(スマホの上部バーと合わせて画面より高くなり、余計な縦スクロールが出るのを防ぐ)
export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="px-4 py-8">
      <div className="mx-auto w-full max-w-md">{children}</div>
    </main>
  )
}
