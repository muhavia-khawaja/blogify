import { Inter, Lora } from 'next/font/google'
import './globals.css'

import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  style: ['italic', 'normal'],
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={`${inter.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  )
}
