import type { Metadata } from 'next'
import HomeWrapper from '@/components/home-wrapper'
import HeroServer from '@/components/hero-server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { fetchProfileServer } from '@/lib/profile-server'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Yurie Blog — Experiments, Side Hustles & Internet Stories',
  description: 'Personal blog about online experiments, AI, creator economy, web development.',
  alternates: { canonical: 'https://yurieblog.vercel.app' }
}

export default async function Page() {
  const supabase = await createServerSupabase()
  
  const { data: { user } } = await supabase.auth.getUser()
  const profile = user ? await fetchProfileServer(user.id) : null

  // ВАЖНО: Добавили content для расчета Read Time на клиенте
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, featured_image, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(9) // Можно взять чуть больше для запаса

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomeWrapper
        initialPosts={posts || []}
        hero={<HeroServer />}
        initialProfile={profile} 
      />
    </Suspense>
  )
}