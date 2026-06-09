'use client'

import { usePathname } from 'next/navigation'

const AUTH_PATHS = ['/login', '/signup', '/forgot', '/write']

export default function ConditionalShell({
  children,
  navbar,
  footer,
}: {
  children: React.ReactNode
  navbar: React.ReactNode
  footer: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = AUTH_PATHS.includes(pathname)

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className='bg-white min-h-screen'>
      {navbar}
      <main>{children}</main>
      {footer}
    </div>
  )
}
