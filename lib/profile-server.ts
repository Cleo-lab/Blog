// lib/profile-server.ts
import { createServerSupabase } from '@/lib/supabaseServer'
import type { Database } from '@/types/database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * СЕРВЕРНЫЙ помощник
 * Используется в Server Components или API Routes
 */
export const fetchProfileServer = async (userId: string | null): Promise<Profile | null> => {
  if (!userId) return null
  
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Server Profile Fetch Error:', error)
    return null
  }
}