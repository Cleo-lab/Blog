'use client'

import dynamic from 'next/dynamic'

const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => mod.Analytics), {
  ssr: false,
  loading: () => null,
})

const GoogleAnalytics = dynamic(() => import('@next/third-parties/google').then(mod => mod.GoogleAnalytics), {
  ssr: false,
  loading: () => null,
})

const CookieBanner = dynamic(() => import('@/components/cookie-banner-client'), {
  ssr: false,
  loading: () => null,
})

export default function AnalyticsClient() {
  return (
    <>
      <Analytics />
      <GoogleAnalytics gaId="G-SV2M5CRN5M" />
      <CookieBanner />
    </>
  )
}