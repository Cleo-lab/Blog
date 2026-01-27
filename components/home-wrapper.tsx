'use client'

import HomeClient from './home-client'
import type { Profile } from '@/lib/profile'

interface HomeWrapperProps {
  initialPosts: any[]
  hero: React.ReactNode
  initialProfile?: Profile | null
}

export default function HomeWrapper({
  initialPosts,
  hero,
  initialProfile,
}: HomeWrapperProps) {
  return (
    <div suppressHydrationWarning>
      <HomeClient
        initialPosts={initialPosts}
        hero={hero}
        initialProfile={initialProfile}
      />
    </div>
  )
}
