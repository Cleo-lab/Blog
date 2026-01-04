'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSupabase } from '@/hooks/use-supabase'

interface AnalyticsTrackerProps {
  isAdmin: boolean
}

export default function AnalyticsTracker({ isAdmin }: AnalyticsTrackerProps) {
  const supabase = useSupabase()
  const pathname = usePathname()

  useEffect(() => {
    if (isAdmin || !supabase) return

    const trackView = async () => {
      try {
        let visitorId = localStorage.getItem('visitor_id')
        if (!visitorId) {
          visitorId = Math.random().toString(36).substring(2, 15)
          localStorage.setItem('visitor_id', visitorId)
        }

        await supabase.from('page_views').insert([
          { page_path: pathname, is_admin_view: false, visitor_id: visitorId }
        ])
      } catch (error) {
        console.error("Error tracking view:", error)
      }
    }

    // ✅ Ленивая загрузка: только после первого клика/скролла
    const onFirstInteraction = () => {
      trackView()
      document.removeEventListener('click', onFirstInteraction)
      document.removeEventListener('scroll', onFirstInteraction)
    }

    document.addEventListener('click', onFirstInteraction, { once: true })
    document.addEventListener('scroll', onFirstInteraction, { once: true })

    return () => {
      document.removeEventListener('click', onFirstInteraction)
      document.removeEventListener('scroll', onFirstInteraction)
    }
  }, [pathname, isAdmin, supabase])

  return null
}