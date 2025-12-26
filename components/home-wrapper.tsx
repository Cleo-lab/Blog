// components/home-wrapper.tsx
'use client'

import { Suspense } from 'react'
import HomeClient from './home-client'

export default function HomeWrapper({ initialPosts }: { initialPosts: any[] }) {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <HomeClient initialPosts={initialPosts} />
    </Suspense>
  )
}