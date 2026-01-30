'use client'

import { Suspense } from 'react' // 1. Импортируем Suspense
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
    // 2. Оборачиваем компонент, использующий searchParams, в Suspense
    <Suspense fallback={<div className="min-h-screen" />}> 
      <HomeClient
        initialPosts={initialPosts}
        hero={hero}
        initialProfile={initialProfile}
      />
    </Suspense>
  )
}