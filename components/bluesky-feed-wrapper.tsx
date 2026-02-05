'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const BlueskyFeed = dynamic(() => import('./bluesky-feed'), { ssr: false })

function FeedSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-16 bg-muted rounded-lg"></div>
      <div className="h-16 bg-muted rounded-lg"></div>
    </div>
  )
}

export default function BlueskyFeedWrapper() {
  return (
    <Suspense fallback={<FeedSkeleton />}>
      <BlueskyFeed />
    </Suspense>
  )
}