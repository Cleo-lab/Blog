import { Suspense } from 'react'
import type { Metadata } from 'next'
import HeroServer from '@/components/hero-server'
import HomeClient from '@/components/home-client'
import { createServiceSupabase } from '@/lib/supabaseServer'
import { fetchProfileServer } from '@/lib/profile-server'

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: 'Digital Experiments',
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
    <>
      <h1 style={{ 
        position: 'absolute', 
        width: '1px', 
        height: '1px', 
        padding: '0', 
        margin: '-1px', 
        overflow: 'hidden', 
        clip: 'rect(0, 0, 0, 0)', 
        whiteSpace: 'nowrap', 
        border: '0' 
      }}>
        Yurie Blog - Digital Business Experiments & Creator Economy Insights
      </h1>
      <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
        <HomeClient 
          hero={<HeroServer />}
          initialPosts={posts}
          initialProfile={profile}
        />
      </Suspense>
    </>
  )
}