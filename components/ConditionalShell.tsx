'use client'

import { usePathname } from 'next/navigation'

const AUTH_PATHS = ['/login', '/signup', '/forgot']

export default function ConditionalShell({
  children,
  footer,
}: {
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  const pathname = usePathname()

  const isAuthPage = AUTH_PATHS.includes(pathname)

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className='min-h-screen bg-[#f8f9fc]'>
      <main className='min-h-screen'>{children}</main>

      {footer}
    </div>
  )
}
