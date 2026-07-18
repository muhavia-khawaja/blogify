import { MetadataRoute } from 'next'
import { getAbsoluteUrl } from '@/utils/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/control/', '/dashboard'],
      },
    ],
    sitemap: [getAbsoluteUrl('/sitemap.xml')],
  }
}
