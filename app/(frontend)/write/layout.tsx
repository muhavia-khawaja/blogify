import type { Metadata } from 'next'
import { buildMetadata } from '@/utils/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Write',
  description: 'Create and publish your next article on Blogify.',
  path: '/write',
  type: 'website',
})

export default function WriteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
