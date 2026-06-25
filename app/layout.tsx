import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '인간연합 — Human Alliance',
  description: 'AI 시대에 인간다움을 연구·보존하는 조직. Zero Productive. 100% Human.',
  openGraph: {
    title: '인간연합 — Human Alliance',
    description: 'AI를 쓰되, 인간을 해치지 않겠습니다.',
    locale: 'ko_KR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  )
}
