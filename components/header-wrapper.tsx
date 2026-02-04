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
  
  const { isLoggedIn, isAdmin } = useAuth()
  const [language, setLanguage] = useState('en')

  const sectionFromUrl = searchParams.get('section') || 'home'

  const handleSetSection = useCallback((section: string) => {
    // 1. Если кликнули "Админка"
    if (section === 'admin') {
      router.push('/admin')
      return
    }

    // 2. Если кликнули "Профиль"
    if (section === 'profile') {
      router.push('/dashboard')
      return
    }

    // 3. Если кликнули "Вход" или "Регистрация" (открываем модалку на главной)
    if (section === 'signin') {
  router.push('/signin')  // ← На отдельную страницу
  return
}
if (section === 'signup') {
  router.push('/signup')  // ← На отдельную страницу
  return
}

    // 4. Если кликнули "Home" (Домой)
    if (section === 'home') {
      if (pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        router.push('/')
      }
      return
    }

    // Для остальных случаев (например, поддержка)
    router.push(`/?section=${section}`)
  }, [pathname, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // После выхода жестко обновляем страницу, чтобы сбросить все стейты
    window.location.href = '/'
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