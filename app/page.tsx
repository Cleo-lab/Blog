import type { Metadata } from 'next'
import HomeWrapper from '@/components/home-wrapper'
import HeroServer from '@/components/hero-server'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Yurie Blog — Experiments, Side Hustles & Internet Stories',
  description: 'Personal blog about online experiments, AI, creator economy, web development, and real internet stories.',
  alternates: { canonical: 'https://yurieblog.vercel.app' }
}


export default function Page() {
  return (
    <HomeWrapper
      initialPosts={[]}
      hero={<HeroServer />}
    />
  )
}