'use client'
import { getBrowserSupabaseClient } from '@/lib/supabase-client'

export const useSupabase = () => getBrowserSupabaseClient()