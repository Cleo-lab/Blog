import { Suspense } from 'react'
import type { Metadata } from 'next'
import HeroServer from '@/components/hero-server'
import HomeClient from '@/components/home-client'
import { createServiceSupabase } from '@/lib/supabaseServer'
import { fetchProfileServer } from '@/lib/profile-server'

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: 'Yurie Blog | Digital Experiments by Yurie Jiyūbō',
  description: 'Digital business experiments, creator economy analytics and monetization strategies by Yurie Jiyūbō.',
  alternates: { canonical: siteUrl },
}

export const revalidate = 86400

export default async function Page() {
  const supabase = createServiceSupabase()
  let posts: any[] = []
  let profile = null

  try {
    const [{ data: { user } }, { data: postsData }] = await Promise.all([
      supabase.auth.getUser(),
      supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, content, featured_image, created_at, updated_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(9)
    ])
    
    profile = user ? await fetchProfileServer(user.id) : null
    posts = postsData || []
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      {/* Передаем Hero как проп в клиентский компонент */}
      <HomeClient 
        hero={<HeroServer />}
        initialPosts={posts}
        initialProfile={profile}
      />
    </Suspense>
  )
}