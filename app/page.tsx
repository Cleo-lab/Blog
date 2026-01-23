import type { Metadata } from 'next'
import HomeWrapper from '@/components/home-wrapper'
import HeroServer from '@/components/hero-server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { fetchProfileServer } from '@/lib/profile-server'
import { Suspense } from 'react'

export const metadata: Metadata = {
  // Заменили "Side Hustles" на "Digital Business"
  title: 'Yurie Blog: Digital Business Experiments & Creator Economy Data',
  // Убрали "NSFW", переформулировали в бизнес-контекст
  description: 'Real stories about digital business experiments, creator economy analytics, monetization strategies, and data-driven entrepreneurship. Honest insights from online business trenches.',
  keywords: [
    'digital entrepreneurship',
    'creator economy insights', 
    'online business experiments',
    'content monetization strategies',
    'digital marketing analytics',
    'data-driven content creation',
    'web development',
    'business storytelling'
  ],
  authors: [{ name: 'Yurie', url: 'https://yurieblog.vercel.app' }],
  creator: 'Yurie',
  publisher: "Yurie's Blog",
  alternates: {
    canonical: 'https://yurieblog.vercel.app',
  },
  openGraph: {
    title: 'Yurie Blog: Digital Business Experiments & Creator Economy',
    description: 'Honest stories about online business experiments, monetization platforms, and the creator economy reality.',
    url: 'https://yurieblog.vercel.app',
    siteName: "Yurie's Blog",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/Yurie_main.jpg',
        width: 1200,
        height: 630,
        alt: 'Yurie Blog — Digital Business Experiments',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yurie Blog: Digital Business & Creator Economy',
    description: 'Real stories from the digital entrepreneurship trenches. Data-driven insights, no fluff.',
    images: ['/images/Yurie_main.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function Page() {
  const supabase = await createServerSupabase()

  const { data: { user } } = await supabase.auth.getUser()
  const profile = user ? await fetchProfileServer(user.id) : null

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, featured_image, created_at, updated_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(9)


  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://yurieblog.vercel.app/#website',
    name: "Yurie's Blog",
    url: 'https://yurieblog.vercel.app',
    // Переформулировали описание
    description: 'Personal blog about digital business experiments, creator economy analytics, and data-driven entrepreneurship.',
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      '@id': 'https://yurieblog.vercel.app/#organization',
      name: "Yurie's Blog",
      logo: {
        '@type': 'ImageObject',
        url: 'https://yurieblog.vercel.app/images/Yurie_main.jpg',
      },
    },
  }

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://yurieblog.vercel.app/#blog',
    name: "Yurie's Blog",
    url: 'https://yurieblog.vercel.app',
    blogPost: posts?.slice(0, 5).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://yurieblog.vercel.app/blog/${post.slug}`,
      datePublished: post.created_at,
      image: post.featured_image || 'https://yurieblog.vercel.app/images/Yurie_main.jpg',
      author: {
        '@type': 'Person',
        name: 'Yurie',
      },
    })),
  }

  return (
    <>
    <h1 className="sr-only">Yurie Blog - Digital Business Experiments & Creator Economy Insights</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
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