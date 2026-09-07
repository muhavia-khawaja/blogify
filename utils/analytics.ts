'use server'

import prisma from '@/prisma/script'
import { headers } from 'next/headers'

interface TrackViewParams {
  articleId: string
  userId?: string | null
  sessionId?: string
  duration: number
  scrollDepth: number
  referrer?: string
}

interface TrackImpressionParams {
  articleId: string
  userId?: string | null
  sessionId?: string
  location?: string
}

async function getDeviceType(): Promise<string> {
  const headerList = await headers()
  const userAgent = headerList.get('user-agent') || ''
  if (/mobile/i.test(userAgent)) return 'MOBILE'
  if (/tablet/i.test(userAgent)) return 'TABLET'
  return 'DESKTOP'
}


export async function trackArticleView({
  articleId,
  userId = null,
  sessionId,
  duration,
  scrollDepth,
  referrer,
}: TrackViewParams) {
  try {
    const deviceType = await getDeviceType()

    const view = await prisma.view.create({
      data: {
        articleId,
        userId: userId || null,
        sessionId,
        duration,
        scrollDepth,
        deviceType,
        referrer,
      },
    })

    const isGuest = !userId
    const isBounce = duration < 10

    await prisma.articleAnalytics.upsert({
      where: { articleId },
      create: {
        articleId,
        totalViews: 1,
        guestViews: isGuest ? 1 : 0,
        userViews: isGuest ? 0 : 1,
        totalReadTimeSec: duration,
        avgReadTimeSec: duration,
        avgScrollDepth: scrollDepth,
        bounceCount: isBounce ? 1 : 0,
      },
      update: {
        totalViews: { increment: 1 },
        guestViews: isGuest ? { increment: 1 } : undefined,
        userViews: !isGuest ? { increment: 1 } : undefined,
        totalReadTimeSec: { increment: duration },
        bounceCount: isBounce ? { increment: 1 } : undefined,
      },
    })

    const agg = await prisma.view.aggregate({
      where: { articleId },
      _avg: {
        duration: true,
        scrollDepth: true,
      },
    })

    if (agg._avg) {
      await prisma.articleAnalytics.update({
        where: { articleId },
        data: {
          avgReadTimeSec: Math.round(agg._avg.duration || 0),
          avgScrollDepth: Math.round(agg._avg.scrollDepth || 0),
        },
      })
    }

    return { success: true, viewId: view.id }
  } catch (error) {
    console.error('Error tracking article view:', error)
    return { success: false, error: 'Failed to record analytics view' }
  }
}

export async function trackArticleImpression({
  articleId,
  userId = null,
  sessionId,
  location = 'FEED',
}: TrackImpressionParams) {
  try {
    const deviceType = await getDeviceType()

    await prisma.impression.create({
      data: {
        articleId,
        userId: userId || null,
        sessionId,
        deviceType,
        location,
      },
    })

    await prisma.articleAnalytics.upsert({
      where: { articleId },
      create: {
        articleId,
        totalImpressions: 1,
      },
      update: {
        totalImpressions: { increment: 1 },
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error tracking impression:', error)
    return { success: false }
  }
}
