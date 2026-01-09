'use client'

import type { Database } from '@/types/database.types'
import { useSupabase } from '@/hooks/use-supabase'

export type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * КЛИЕНТСКИЙ помощник
 * Используется внутри компонентов с 'use client'
 */
export const fetchProfileClient = async (userId: string | null): Promise<Profile | null> => {
  if (!userId) return null
  
  // ВАЖНО: хук useSupabase должен вызываться внутри компонента. 
  // Если вы вызываете это как обычную функцию, лучше передавать экземпляр supabase аргументом.
  // Но если оставить так, убедитесь, что функция вызывается там, где контекст доступен.
  const supabase = useSupabase() 
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*') // Выбираем всё, чтобы соответствовать типу Profile
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  return data
}