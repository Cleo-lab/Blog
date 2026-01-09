import type { Metadata } from 'next'
import HomeWrapper from '@/components/home-wrapper'
import HeroServer from '@/components/hero-server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { fetchProfileServer } from '@/lib/profile-server' // Тот самый импорт
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Yurie Blog — Experiments, Side Hustles & Internet Stories',
  description: 'Personal blog about online experiments, AI, creator economy, web development.',
  alternates: { canonical: 'https://yurieblog.vercel.app' }
}

export default async function Page() {
  const supabase = await createServerSupabase()
  
  // 1. Получаем сессию пользователя на сервере
  const { data: { user } } = await supabase.auth.getUser()
  
  // 2. Если пользователь есть, загружаем его профиль прямо здесь
  const profile = user ? await fetchProfileServer(user.id) : null

  // 3. Загружаем посты для контента
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, featured_image, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeWrapper
        initialPosts={posts || []}
        hero={<HeroServer />}
        initialProfile={profile} 
      />
    </Suspense>
  )
}