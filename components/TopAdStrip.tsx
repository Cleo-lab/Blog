'use client'

import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function TopAdStrip() {
  const adRef = useRef<HTMLModElement | null>(null)

  useEffect(() => {
    try {
      const adEl = adRef.current
      if (!adEl || (adEl as any).dataset.adsbygoogleStatus) return

      const ads = (window.adsbygoogle = window.adsbygoogle || [])
      ads.push({})
    } catch (err) {
      console.error('Adsense initialization error:', err)
    }
  }, [])

  return (
    <aside className="w-full h-[100px] bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 relative overflow-hidden">
      {/* фоновый узор */}
      <div className="absolute inset-0 opacity-20">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            fill="#fff"
            d="M0,70 C240,20 480,5 720,25 C960,45 1200,30 1440,50 L1440,100 L0,100 Z"
          />
        </svg>
      </div>

      <div className="relative z-10 flex h-full items-center justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '728px', height: '90px' }}
          data-ad-client="ca-pub-0000000000000000"
          data-ad-slot="0000000000"
          data-adtest="on"
        />
      </div>
    </aside>
  )
}