// components/SupabaseProvider.tsx
'use client'

import { useEffect, useState } from 'react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { getBrowserSupabaseClient } from '@/lib/supabase-client'

export default function SupabaseProvider({
  children,
  initialSession,
}: {
  readonly children: React.ReactNode
  readonly initialSession?: any
}) {
  const [supabase, setSupabase] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only call getBrowserSupabaseClient in useEffect on client
    if (typeof globalThis.window !== 'undefined') {
      setSupabase(getBrowserSupabaseClient())
      setMounted(true)
    }
  }, [])

  // Don't render SessionContextProvider until client is ready
  if (!mounted || !supabase) {
    return <>{children}</>
  }

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  )
}