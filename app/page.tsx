// app/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import HomeWrapper from '@/components/home-wrapper'
import HeroServer from '@/components/hero-server'
import { createServiceSupabase } from '@/lib/supabaseServer'
import { fetchProfileServer } from '@/lib/profile-server'

const siteUrl = 'https://yurieblog.vercel.app'

// Metadata — остается как была
export const metadata: Metadata = {
  title: 'Yurie Blog: Digital Business Experiments & Creator Economy Data',
  description: 'Digital business experiments, creator economy analytics & monetization strategies.',
  alternates: { canonical: siteUrl },
  // ... остальные поля метаданных
}

export default async function Page() {
  const supabase = createServiceSupabase()
  let posts: any[] = []
  let profile = null

  try {
    const { data: { user } } = await supabase.auth.getUser()
    profile = user ? await fetchProfileServer(user.id) : null

    const { data: postsData } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, content, featured_image, created_at, updated_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(9)

    posts = postsData || []
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  // СХЕМА WEBSITE (Sitelinks) — ТЕПЕРЬ ТУТ
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: "Yurie's Blog",
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/archiveblog?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    mainEntity: [
      { '@type': 'SiteNavigationElement', name: 'Blog Archive', url: `${siteUrl}/archiveblog` },
      { '@type': 'SiteNavigationElement', name: 'Gallery', url: `${siteUrl}/archivegallery` }
    ]
  }

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${siteUrl}/#blog`,
    name: "Yurie's Blog",
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.created_at
    }))
  }

  return (
    <>
      {/* Эти скрипты Google увидит ПЕРВЫМИ, они не зависят от Bailout */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      {/* Обертка Suspense ГАРАНТИРУЕТ, что остальная часть страницы (Layout) 
          отрендерится на сервере, а "проблемный" клиентский код 
          с useSearchParams не сломает SEO всей страницы */}
      <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
        <HomeWrapper
          initialPosts={posts}
          hero={<HeroServer />}
          initialProfile={profile}
        />
      </Suspense>
    </>
  )
}