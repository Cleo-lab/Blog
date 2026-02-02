'use client'

import { useState, useCallback } from 'react'
import Header from './header'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useSupabase } from '@/hooks/use-supabase'

export default function HeaderWrapper() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const supabase = useSupabase()
  
  // Получаем данные об авторизации из вашего хука
  const { isLoggedIn, isAdmin } = useAuth()
  
  // Состояние языка (по умолчанию en)
  const [language, setLanguage] = useState('en')

  // Определяем текущую секцию на основе URL
  const sectionFromUrl = searchParams.get('section') || 'home'

  // Функция переключения секций через URL
  const handleSetSection = useCallback((section: string) => {
    // Если мы не на главной, сначала переходим на главную с нужным параметром
    if (pathname !== '/') {
      router.push(`/?section=${section}`)
      return
    }

    // Если мы на главной
    if (section === 'home') {
      router.push('/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push(`/?section=${section}`)
    }
  }, [pathname, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  return (
    <Header 
      currentSection={sectionFromUrl}
      setCurrentSection={handleSetSection}
      language={language}
      setLanguage={setLanguage}
      isLoggedIn={isLoggedIn}
      isAdmin={isAdmin}
      onSignOut={handleSignOut}
    />
  )
}