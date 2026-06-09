import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import ConditionalShell from '@/components/ConditionalShell'
import React, { Suspense } from 'react'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConditionalShell
      navbar={
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      }
      footer={<Footer />}
    >
      {children}
    </ConditionalShell>
  )
}
