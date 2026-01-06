'use client'

import { useEffect } from 'react'

// Добавляем типы для window
declare global {
  interface Window {
    dataLayer: any[]
    gtag?: (...args: any[]) => void
  }
}

export default function AnalyticsLazy() {
  useEffect(() => {
    let loaded = false

    const onFirstInteraction = () => {
      if (loaded) return
      loaded = true

      // Google Analytics
      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=G-SV2M5CRN5M`
      script.async = true
      document.head.appendChild(script)

      script.onload = () => {
        window.dataLayer = window.dataLayer || []
        function gtag(...args: any[]) {
          window.dataLayer.push(args)
        }
        gtag('js', new Date())
        gtag('config', 'G-SV2M5CRN5M')
      }

      // Vercel Analytics - исправленный импорт
      import('@vercel/analytics/react')
        .then((mod) => {
          // Vercel Analytics автоматически инициализируется
          // Не нужно вручную создавать контейнер
          console.log('Vercel Analytics loaded')
        })
        .catch((err) => {
          console.warn('Vercel Analytics failed to load:', err)
        })

      // Убираем слушатели
      document.removeEventListener('click', onFirstInteraction)
      document.removeEventListener('touchstart', onFirstInteraction)
      document.removeEventListener('scroll', onFirstInteraction)
    }

    // Добавляем слушатели с { once: true } для автоматического удаления
    document.addEventListener('click', onFirstInteraction, { once: true, passive: true })
    document.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true })
    document.addEventListener('scroll', onFirstInteraction, { once: true, passive: true })

    // Cleanup на случай если компонент размонтируется до взаимодействия
    return () => {
      if (!loaded) {
        document.removeEventListener('click', onFirstInteraction)
        document.removeEventListener('touchstart', onFirstInteraction)
        document.removeEventListener('scroll', onFirstInteraction)
      }
    }
  }, [])

  return null
}