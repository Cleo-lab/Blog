'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSupabase } from '@/hooks/use-supabase'

export function useAuth() {
  const supabase = useSupabase() // ✅ один клиент на всё приложение
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    if (!supabase) return // ✅ защита от SSR или неинициализированного клиента

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setUser(null)
        setEmail('')
        setIsLoggedIn(false)
        setIsAdmin(false)
        setAvatarUrl('')
        return
      }

      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        setUser(null)
        setEmail('')
        setIsLoggedIn(false)
        setIsAdmin(false)
        setAvatarUrl('')
        return
      }

      setUser(user)
      setEmail(user.email ?? '')
      setIsLoggedIn(true)

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, avatar_url')
        .eq('id', user.id)
        .maybeSingle()

      setIsAdmin(profile?.is_admin ?? false)
      setAvatarUrl(profile?.avatar_url ?? '')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser()
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