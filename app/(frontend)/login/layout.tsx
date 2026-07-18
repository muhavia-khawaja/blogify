import type { Metadata } from 'next'
import { buildMetadata } from '@/utils/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Login',
  description:
    'Sign in to your Blogify account to manage your profile and articles.',
  path: '/login',
  type: 'website',
})

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
