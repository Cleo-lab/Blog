/* lib/supabase-client.ts */
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const getBrowserSupabaseClient = () => {
  if (typeof window === 'undefined') {
    // Возвращаем заглушку, чтобы не падало при импорте
    return null as any
  }

  const global = window as any
  if (!global.__supabase_client__)
    global.__supabase_client__ = createClient<Database>(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  return global.__supabase_client__
}