'use client'

import { useEffect } from 'react'

export default function AnalyticsLazy() {
  useEffect(() => {
    const onFirstInteraction = () => {
      // Google Analytics
      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=G-SV2M5CRN5M`
      script.async = true
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      function gtag(...args: any[]) {
        window.dataLayer.push(args)
      }
      gtag('js', new Date())
      gtag('config', 'G-SV2M5CRN5M')

      // Vercel Analytics
      import('@vercel/analytics/react').then(mod => {
        const Analytics = mod.Analytics
        const container = document.createElement('div')
        container.id = 'vercel-analytics'
        document.body.appendChild(container)
        // @ts-ignore
        Analytics && (Analytics as any)({ container })
      })

      // Убираем слушатели
      document.removeEventListener('click', onFirstInteraction)
      document.removeEventListener('touchstart', onFirstInteraction)
      document.removeEventListener('scroll', onFirstInteraction)
    }

    document.addEventListener('click', onFirstInteraction, { once: true })
    document.addEventListener('touchstart', onFirstInteraction, { once: true })
    document.addEventListener('scroll', onFirstInteraction, { once: true })

    return () => {
      document.removeEventListener('click', onFirstInteraction)
      document.removeEventListener('touchstart', onFirstInteraction)
      document.removeEventListener('scroll', onFirstInteraction)
    }
  }, [])

  return null
}