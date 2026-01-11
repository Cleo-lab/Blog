import type { Metadata } from 'next'
import HomeWrapper from '@/components/home-wrapper'
import HeroServer from '@/components/hero-server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { fetchProfileServer } from '@/lib/profile-server'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Yurie Blog — Experiments, Side Hustles & Internet Stories',
  description: 'Personal blog about online experiments, AI, creator economy, web development.',
  alternates: {
    canonical: 'https://yurieblog.vercel.app',
  },
}

export default async function Page() {
  const supabase = await createServerSupabase()

  const { data: { user } } = await supabase.auth.getUser()
  const profile = user ? await fetchProfileServer(user.id) : null

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, featured_image, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(9)

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "Yurie's Blog",
    url: 'https://yurieblog.vercel.app',
    description: 'Personal blog about online experiments, AI, creator economy, web development.',
    author: {
      '@type': 'Person',
      name: 'Yurie Jiyūbō',
      url: 'https://yurieblog.vercel.app',
      image: 'https://yurieblog.vercel.app/images/Yurie_main.jpg',
      sameAs: ['https://bsky.app/profile/yurieblog.bsky.social'],
    },
    publisher: {
      '@type': 'Organization',
      name: "Yurie's Blog",
      logo: {
        '@type': 'ImageObject',
        url: 'https://yurieblog.vercel.app/images/Yurie_main.jpg',
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://yurieblog.vercel.app/archiveblog?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <HomeWrapper
          initialPosts={posts || []}
          hero={<HeroServer />}
          initialProfile={profile}
        />
      </Suspense>
    </>
  )
}
