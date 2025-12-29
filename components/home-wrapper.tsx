'use client'

import { Suspense } from 'react'
import HomeClient from './home-client'

// ✅ Добавляем hero в пропсы
export default function HomeWrapper({ initialPosts, hero }: { initialPosts: any[], hero: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <HomeClient initialPosts={initialPosts} hero={hero} />
    </Suspense>
  )
}