import type { Metadata } from 'next'
import { buildMetadata } from '@/utils/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Sign Up',
  description:
    'Create a Blogify account to publish, comment, and manage your reading profile.',
  path: '/signup',
  type: 'website',
})

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
