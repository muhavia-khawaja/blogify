'use client'

import { useEffect, useRef } from 'react'

const ADSENSE_CLIENT = 'ca-pub-7339717436236652'

type AdBannerProps = {
  adSlot?: string
  adFormat?: string
  fullWidthResponsive?: boolean
  className?: string
}

export default function AdBanner({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    if (!adSlot || !adRef.current) return

    const ad = adRef.current

    if (
      ad.dataset.adsenseInitialized === 'true' ||
      ad.dataset.adsbygoogleStatus
    ) {
      return
    }

    ad.dataset.adsenseInitialized = 'true'

    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch (error) {
      console.error('AdSense initialization failed:', error)
    }
  }, [adSlot])

  if (!adSlot) return null

  return (
    <div
      className={`min-h-[100px] w-full overflow-hidden ${className}`}
      aria-label='Advertisement'
    >
      <ins
        ref={adRef}
        className='adsbygoogle block min-h-[100px] w-full'
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  )
}
