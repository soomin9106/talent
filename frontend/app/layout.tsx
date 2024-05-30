import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Roboto } from 'next/font/google'
import './globals.css'
import Providers from './_utils/Provider'
import { GoogleAnalytics } from '@next/third-parties/google'
import { GoogleTagManager } from '@next/third-parties/google'

const roboto = Roboto({ weight: "500", subsets: ['latin'] })

export const metadata: Metadata = {
  title: '예명교회 아동부',
  description: '예명교회 아동부 인적사항 관리',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body className={roboto.className}>
        <Providers>
          {/* <GoogleAnalytics gaId={process.env.NEXT_GA_TRACKING_ID ?? ''} /> */}
          <GoogleTagManager gtmId={process.env.NEXT_GTM_ID ?? ''} /> 
          {children}
        </Providers>
      </body>

    </html>
  )
}
