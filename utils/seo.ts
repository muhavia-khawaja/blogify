import type { Metadata } from 'next'

export const SITE_NAME = 'EWHAMZA'
export const SITE_TAGLINE = 'Insights, stories, and ideas'
export const SITE_DESCRIPTION =
  'Explore thoughtful articles, practical insights, and curated stories on EWHAMZA.'
export const SITE_DEFAULT_IMAGE = '/banner.jpg'
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blog.ewhamza.com'

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const truncateText = (value: string, maxLength: number) => {
  const cleaned = stripHtml(value || '').trim()
  if (!cleaned) return ''
  if (cleaned.length <= maxLength) return cleaned
  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`
}

export function getAbsoluteUrl(path = '/', base = SITE_URL) {
  try {
    return new URL(path, base).toString()
  } catch {
    const baseUrl = base.replace(/\/$/, '')
    const relativePath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl}${relativePath}`
  }
}

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    url: getAbsoluteUrl('/'),
    images: [
      {
        url: getAbsoluteUrl(SITE_DEFAULT_IMAGE),
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [getAbsoluteUrl(SITE_DEFAULT_IMAGE)],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
}

export function buildMetadata({
  title,
  description,
  path = '/',
  image = SITE_DEFAULT_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors = [],
  noIndex = false,
}: {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: Date | string | null
  modifiedTime?: Date | string | null
  authors?: string[]
  noIndex?: boolean
}): Metadata {
  const pageTitle = truncateText(title || SITE_NAME, 60)
  const pageDescription = truncateText(description || SITE_DESCRIPTION, 155)
  const canonicalUrl = getAbsoluteUrl(path)
  const imageUrl = getAbsoluteUrl(image)

  return {
    title: {
      absolute: pageTitle
        ? `${pageTitle} | ${SITE_NAME}`
        : `${SITE_NAME} — ${SITE_TAGLINE}`,
    },
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle || SITE_NAME,
      description: pageDescription,
      url: canonicalUrl,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle || SITE_NAME,
        },
      ],
      ...(publishedTime
        ? { publishedTime: new Date(publishedTime).toISOString() }
        : {}),
      ...(modifiedTime
        ? { modifiedTime: new Date(modifiedTime).toISOString() }
        : {}),
      ...(authors.length ? { authors } : {}),
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle || SITE_NAME,
      description: pageDescription,
      images: [imageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  }
}
