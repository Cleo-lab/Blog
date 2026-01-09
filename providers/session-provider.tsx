// Create providers/session-provider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSupabase } from '@/hooks/use-supabase'
import type { Session, User } from '@supabase/supabase-js'

interface SessionContextType {
  session: Session | null
  user: User | null
  loading: boolean
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  loading: true,
})

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return context
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    let mounted = true

    try {
      if (typeof window === 'undefined') {
        if (mounted) setLoading(false)
        return
      }

      const client = useSupabase()
      setSupabase(client)

      const initSession = async () => {
        try {
          const { data: { session }, error } = await client.auth.getSession()
          if (mounted) {
            if (error) console.debug('Failed to get session:', error)
            setSession(session ?? null)
            setUser(session?.user ?? null)
            setLoading(false)
          }
        } catch (err) {
          console.debug('Session initialization error:', err)
          if (mounted) {
            setSession(null)
            setUser(null)
            setLoading(false)
          }
        }
      }

      initSession()

      const { data: { subscription } } = client.auth.onAuthStateChange(
        async (event: any, session: any) => {
          if (!mounted) return
          console.debug('Auth event:', event)
          setSession(session ?? null)
          setUser(session?.user ?? null)
          if (event === 'SIGNED_OUT') {
            setSession(null)
            setUser(null)
          }
        }
      )

      return () => {
        mounted = false
        subscription.unsubscribe()
      }
    } catch (err) {
      console.debug('SessionProvider error:', err)
      if (mounted) setLoading(false)
    }
  }, [])

  return (
    <SessionContext.Provider value={{ session, user, loading }}>
      {children}
    </SessionContext.Provider>
  )
}
