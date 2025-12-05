'use client'
import type { Database } from '@/types/database.types'
import { useSupabase } from '@/hooks/use-supabase'
import { createServerSupabase } from './supabaseServer'

export type Profile = Database['public']['Tables']['profiles']['Row']

// Client-side helper
export const fetchProfileClient = async (userId: string | null): Promise<Profile | null> => {
  if (!userId) return null
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, is_admin, created_at, updated_at')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// Server-side helper
export const fetchProfileServer = async (userId: string | null): Promise<Profile | null> => {
  if (!userId) return null
  const supabase = await createServerSupabase()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, is_admin, created_at, updated_at')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}
