'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const DonorList = dynamic(() => import('./donor-list'), { ssr: false })

function DonorListSkeleton() {
  return (
    <div className="flex flex-col items-center py-8 space-y-2 animate-pulse">
      <div className="h-4 w-32 bg-muted rounded"></div>
      <div className="h-20 w-full bg-muted/50 rounded-2xl"></div>
    </div>
  )
}

export default function DonorListWrapper() {
  return (
    <Suspense fallback={<DonorListSkeleton />}>
      <DonorList />
    </Suspense>
  )
}