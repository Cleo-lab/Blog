'use client'

import { ReactNode } from 'react'
import SupabaseProvider from '@/components/SupabaseProvider'
import TopAdStrip from './TopAdStrip'

export function ProvidersWrapper({ children }: { children: ReactNode }) {
  return (
    <SupabaseProvider>
      <TopAdStrip />
      {children}
    </SupabaseProvider>
  )
}



