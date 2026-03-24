import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blogify - Modern Blog for Tech & Development Insights',
  description:
    'Discover insights on web development, design trends, technology, and modern development practices. Read articles from expert writers.',
  keywords: 'blog, technology, web development, design, tutorials, insights',
  openGraph: {
    title: 'Blogify - Modern Blog for Tech Insights',
    description:
      'Discover insights on web development, design trends, and technology',
    url: 'https://blogify.example.com',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='bg-white'>
        <main>{children}</main>
      </body>
    </html>
  )
}
