import type { Metadata } from 'next'
import { buildMetadata } from '@/utils/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Simple & Transparent Pricing Plans',
  description:
    'Choose the perfect plan for Education with Hamza. Access AI-powered study tools, paper schemes, translation tools, and premium learning materials with instant JazzCash payment.',
  path: '/pricing',
  type: 'website',
})

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Pricing Plans - Education with Hamza',
    description:
      'Simple and affordable pricing plans for AI-powered study tools and educational resources.',
    url: 'https://ewhamza.com/pricing',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://ewhamza.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Pricing',
          item: 'https://ewhamza.com/pricing',
        },
      ],
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Pro Monthly Plan',
        price: '999',
        priceCurrency: 'PKR',
        availability: 'https://schema.org/InStock',
        url: 'https://ewhamza.com/pricing',
      },
      {
        '@type': 'Offer',
        name: 'Pro Yearly Plan',
        price: '7999',
        priceCurrency: 'PKR',
        availability: 'https://schema.org/InStock',
        url: 'https://ewhamza.com/pricing',
      },
    ],
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
