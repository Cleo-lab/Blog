'use client'
import { getBrowserSupabaseClient } from '@/lib/supabase-client'

// ✅ уже singleton, просто возвращаем
export const useSupabase = getBrowserSupabaseClient