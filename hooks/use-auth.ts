'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSupabase } from '@/hooks/use-supabase'
import type { Profile } from '@/lib/profile'

// Добавляем возможность передать начальные данные (с сервера)
export function useAuth(initialProfile?: Profile | null) {
  const supabase = useSupabase()
  
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  
  // ✅ Если пришел initialProfile, сразу ставим isLoggedIn = true
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialProfile)
  const [isAdmin, setIsAdmin] = useState(initialProfile?.is_admin ?? false)
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url ?? '')
  
  // ✅ Если есть серверный профиль, загрузку можно не показывать сразу
  const [loading, setLoading] = useState(!initialProfile)

  const loadUser = useCallback(async () => {
    if (!supabase) return

    try {
      // getSession быстрее, чем getUser, используем его для первичной проверки
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        resetStates()
        return
      }

      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      if (error || !authUser) {
        resetStates()
        return
      }

      setUser(authUser)
      setEmail(authUser.email ?? '')
      setIsLoggedIn(true)

      // Загружаем актуальный профиль из БД
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, avatar_url')
        .eq('id', authUser.id)
        .maybeSingle()

      if (profile) {
        setIsAdmin(profile.is_admin ?? false)
        setAvatarUrl(profile.avatar_url ?? '')
      }
    } catch (err) {
      console.error('Auth check error:', err)
      resetStates()
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Вспомогательная функция для сброса
  const resetStates = () => {
    setUser(null)
    setEmail('')
    setIsLoggedIn(false)
    setIsAdmin(false)
    setAvatarUrl('')
    setLoading(false)
  }

  useEffect(() => {
    loadUser()

    // Слушаем изменения: вход, выход, смена пароля
    const { data: listener } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_OUT') {
        resetStates()
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadUser()
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [loadUser, supabase])

  const refresh = useCallback(() => loadUser(), [loadUser])

  return {
    user,
    email,
    isLoggedIn,
    isAdmin,
    avatarUrl,
    loading,
    refresh,
  }
}