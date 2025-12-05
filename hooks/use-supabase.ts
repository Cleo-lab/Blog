'use client'
import { useEffect, useState } from 'react'
import { getBrowserSupabaseClient } from '@/lib/supabase-client'

export const useSupabase = () => {
  const [client, setClient] = useState<any>(null)
  useEffect(() => setClient(getBrowserSupabaseClient()), [])
  return client
}