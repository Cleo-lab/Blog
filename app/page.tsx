// app/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import HeroServer from '@/components/hero-server'
import About from '@/components/about'
import BlogSection from '@/components/blog-section'
import GalleryServer from '@/components/gallery-server'
import Subscribe from '@/components/subscribe'
import FootAdBanner from '@/components/FootAdBanner'
import MiddleAdBanner from '@/components/MiddleAdBanner'
import { createServiceSupabase } from '@/lib/supabaseServer'
import { BRAND, getSchemaDescription } from '@/lib/brand-voice'

// ✅ Обычные импорты серверных обёрток
import DonorListWrapper from '@/components/donor-list-wrapper'
import BlueskyFeedWrapper from '@/components/bluesky-feed-wrapper'

export const metadata: Metadata = {
  title: BRAND.titles.homepage,
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
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
}

// ✅ Next.js route config
export const revalidate = 86400
export const dynamic = 'force-static'
export const fetchCache = 'force-cache'

export default async function Page() {
  // Публичные данные только
  const supabase = createServiceSupabase()
  
  let posts: any[] = []

  try {
    const { data: postsData } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, content, featured_image, created_at, updated_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(6)
    
    posts = postsData || []
  } catch (error) {
    console.error('Error fetching public data:', error)
  }

  // JSON-LD Schema
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
        urlTemplate: `${BRAND.siteUrl}/blog?search={search_term_string}`
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
      },
      image: post.featured_image ? {
        '@type': 'ImageObject',
        url: post.featured_image
      } : undefined
    })).filter(Boolean)
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

      <main className="min-h-screen bg-background text-foreground selection:bg-pink-500/30">
        
        <section id="home" className="pt-4 sm:pt-10 pb-4 px-2">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT: Hall of Fame */}
            <aside className="lg:col-span-3 order-2 lg:order-1 sticky top-24">
              <div className="p-1 rounded-[2.6rem] bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 shadow-2xl">
                <div className="p-5 rounded-[2.5rem] bg-zinc-950/90 backdrop-blur-xl h-fit">
                  <h3 className="text-xs font-black mb-6 text-center uppercase tracking-[0.2em] text-white/90">
                    Hall of Fame
                  </h3>
                  {/* ✅ Простой импорт, вся магия внутри wrapper */}
                  <DonorListWrapper />
                </div>
              </div>
            </aside>

            {/* CENTER: Hero */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <HeroServer />
            </div>

            {/* RIGHT: Bluesky Feed */}
            <aside className="lg:col-span-3 order-3 sticky top-24">
              <div className="rounded-[2.5rem] border border-border/40 p-6 bg-card/40 backdrop-blur-md">
                <h3 className="text-sm font-bold mb-4">
                  Live Feed 🦋
                </h3>
                {/* ✅ Простой импорт */}
                <BlueskyFeedWrapper />
              </div>
            </aside>
          </div>

          <div className="max-w-[1440px] mx-auto px-2 sm:px-4">
            <About language="en" />
          </div>
        </section>

        <section id="blog" className="py-2">
          <div className="max-w-[1440px] mx-auto px-2 sm:px-4">
            <h2 className="text-2xl font-bold mb-6">Latest Experiments</h2>
            <BlogSection language="en" initialPosts={posts} />
          </div>
        </section>

        <section id="gallery" className="py-8">
          <div className="max-w-[1440px] mx-auto px-2 sm:px-4">
            <GalleryServer language="en" />
          </div>
        </section>

        <MiddleAdBanner />

        <section id="subscribe" className="py-8">
          <div className="max-w-[1440px] mx-auto px-2 sm:px-4">
            <Subscribe language="en" />
          </div>
        </section>

        <FootAdBanner />
      </main>
    </>
  )
}