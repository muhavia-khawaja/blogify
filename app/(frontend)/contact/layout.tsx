import type { Metadata } from 'next'
import { buildMetadata } from '@/utils/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description:
    'Reach out to Blogify with questions, feedback, or collaboration ideas.',
  path: '/contact',
  type: 'website',
})

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
