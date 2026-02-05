'use client'  // ← ЭТО ДОЛЖНО БЫТЬ!

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const CommentsSection = dynamic(
  () => import('@/app/blog/[slug]/comments-section'), 
  { ssr: false }  // ← Отключаем SSR!
)

export default function CommentsSectionWrapper({ postSlug }: { postSlug: string }) {
  return (
    <Suspense fallback={<div className="h-20 bg-muted/20 rounded-xl animate-pulse" />}>
      <CommentsSection postSlug={postSlug} />
    </Suspense>
  )
}