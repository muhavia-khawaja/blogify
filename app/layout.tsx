import { Inter, Lora } from 'next/font/google'
import './globals.css'

import type { Metadata } from 'next'
import Script from 'next/script'
import { siteMetadata } from '@/utils/seo'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  style: ['italic', 'normal'],
})

export const metadata: Metadata = siteMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={`${inter.variable} ${lora.variable}`}>
      <body>
        <Script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7339717436236652'
          crossOrigin='anonymous'
          strategy='afterInteractive'
        />
        {children}
      </body>
    </html>
  )
}
