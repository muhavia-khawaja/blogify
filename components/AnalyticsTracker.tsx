'use client'

import { useEffect, useRef } from 'react'
import { trackArticleView } from '@/utils/analytics'

interface AnalyticsTrackerProps {
  articleId: string
  userId?: string | null
}

export default function AnalyticsTracker({
  articleId,
  userId,
}: AnalyticsTrackerProps) {
  const startTimeRef = useRef<number>(Date.now())
  const maxScrollRef = useRef<number>(0)
  const sessionIdRef = useRef<string>('')

  useEffect(() => {
    sessionIdRef.current =
      sessionStorage.getItem('analytics_session_id') ||
      `sess_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`

    sessionStorage.setItem('analytics_session_id', sessionIdRef.current)

    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight <= 0) return
      const currentScroll = (window.scrollY / totalHeight) * 100
      if (currentScroll > maxScrollRef.current) {
        maxScrollRef.current = Math.min(100, Math.round(currentScroll))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    const sendMetrics = () => {
      const timeSpentSec = Math.round(
        (Date.now() - startTimeRef.current) / 1000,
      )
      if (timeSpentSec < 2) return

      trackArticleView({
        articleId,
        userId,
        sessionId: sessionIdRef.current,
        duration: timeSpentSec,
        scrollDepth: maxScrollRef.current,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      })
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendMetrics()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      sendMetrics()
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [articleId, userId])

  return null
}
