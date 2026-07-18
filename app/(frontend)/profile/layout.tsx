import type { Metadata } from 'next'
import { buildMetadata } from '@/utils/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Profile',
  description: 'View your Blogify profile, drafts, and published stories.',
  path: '/profile',
  type: 'website',
})

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
