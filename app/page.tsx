import { Suspense } from 'react'
import type { Metadata } from 'next'
import HeroServer from '@/components/hero-server'
import HomeClient from '@/components/home-client'
import { createServiceSupabase } from '@/lib/supabaseServer'
import { fetchProfileServer } from '@/lib/profile-server'
import { BRAND, getDescription, getSchemaDescription } from '@/lib/brand-voice'

export const metadata: Metadata = {
  // ✅ С юмором и индивидуальностью
  title: BRAND.titles.homepage,
  
  // ✅ Честное описание без корпоративного языка
  description: BRAND.descriptions.homepage,
  
  alternates: { canonical: BRAND.siteUrl },
  
  keywords: [
    'digital business experiments',
    'creator economy reality check',
    'honest online monetization',
    'side hustle stories',
    'digital entrepreneurship fails',
    'real business experiments',
    'creator economy insights',
    'online business chaos',
  ],
  
  openGraph: {
    title: `${BRAND.siteName}: Digital Experiments & Creator Economy Reality`,
    description: 'Real stories from digital trenches: successful experiments, spectacular failures, and everything in between. No BS, just data.',
    url: BRAND.siteUrl,
    siteName: BRAND.siteName,
    type: 'website',
    images: [
      {
        url: '/images/Yurie_main.jpg',
        width: 1200,
        height: 630,
        alt: `${BRAND.siteName} — Digital experiments with actual results (and failures)`,
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.siteName}: Honest Digital Experiments`,
    description: 'Real creator economy stories. Actual data. Zero guru promises.',
    images: ['/images/Yurie_main.jpg'],
    creator: '@yurieblog.bsky.social',
  },
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

  // Schema.org (более формальный тон)
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BRAND.siteUrl}/#website`,
    url: BRAND.siteUrl,
    name: BRAND.siteName,
    description: getSchemaDescription('homepage'),
    inLanguage: 'en-US',
    publisher: {
      '@id': `${BRAND.siteUrl}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BRAND.siteUrl}/archiveblog?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${BRAND.siteUrl}/#blog`,
    name: BRAND.siteName,
    description: 'Personal blog documenting digital business experiments, creator economy insights, and online monetization case studies.',
    url: BRAND.siteUrl,
    author: {
      '@id': `${BRAND.siteUrl}/#author`
    },
    publisher: {
      '@id': `${BRAND.siteUrl}/#organization`
    },
    blogPost: posts.slice(0, 5).map(post => ({
      '@type': 'BlogPosting',
      '@id': `${BRAND.siteUrl}/blog/${post.slug}#article`,
      headline: post.title,
      url: `${BRAND.siteUrl}/blog/${post.slug}`,
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      author: {
        '@id': `${BRAND.siteUrl}/#author`
      },
      publisher: {
        '@id': `${BRAND.siteUrl}/#organization`
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      {/* ✅ H1 с индивидуальностью (скрытый для дизайна, видимый для SEO) */}
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
        {BRAND.headings.homepage}
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