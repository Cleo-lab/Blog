// components/SupabaseProvider.tsx
'use client'

import { useEffect, useState } from 'react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { getBrowserSupabaseClient } from '@/lib/supabase-client'

interface SupabaseProviderProps {
  readonly children: React.ReactNode
  readonly initialSession?: any
}

export default function SupabaseProvider({ children, initialSession }: SupabaseProviderProps) {
  const [supabase, setSupabase] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupabase(getBrowserSupabaseClient())
      setMounted(true)
    }
  }, [])

  if (!mounted || !supabase) return <>{children}</>

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  )
}