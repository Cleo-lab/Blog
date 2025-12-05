'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSupabase } from '@/hooks/use-supabase'

interface UserAuth {
  user: any
  email: string
  isLoggedIn: boolean
  isAdmin: boolean
  avatarUrl: string
  loading: boolean
  refresh: () => Promise<void>
}

export function useAuth(): UserAuth {
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)

  const loadUser = useCallback(async (client: any) => {
    try {
      const { data: { session } } = await client.auth.getSession()

      if (!session) {
        setUser(null)
        setEmail('')
        setIsLoggedIn(false)
        setIsAdmin(false)
        setAvatarUrl('')
        return
      }

      const { data: { user }, error } = await client.auth.getUser()
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

      const { data: profile } = await client
        .from('profiles')
        .select('is_admin, avatar_url')
        .eq('id', user.id)
        .maybeSingle()

      setIsAdmin(profile?.is_admin ?? false)
      setAvatarUrl(profile?.avatar_url ?? '')

    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const client = useSupabase()
    setSupabase(client)

    loadUser(client)

    const { data: listener } = client.auth.onAuthStateChange(() => {
      loadUser(client)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [loadUser])

  const refresh = useCallback(async () => {
    setLoading(true)
    await loadUser()
  }, [loadUser])

  return {
    user,
    email,
    isLoggedIn,
    isAdmin,
    avatarUrl,
    loading,
    refresh
  }
}
