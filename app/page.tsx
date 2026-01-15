import type { Metadata } from 'next'
import HomeWrapper from '@/components/home-wrapper'
import HeroServer from '@/components/hero-server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { fetchProfileServer } from '@/lib/profile-server'
import { Suspense } from 'react'

export const metadata: Metadata = {
  // Bing любит заголовки до 60 символов. Делаем четко и по делу.
  title: 'Yurie Blog: Side Hustles & AI Experiments',
  description: 'Real stories about NSFW side hustles, AI experiments, and creator economy reality. No BS, just honest digital experiments and data.',
  keywords: [
    'personal blog', 'side hustle stories', 'creator economy', 
    'AI experiments', 'web development', 'honest internet stories'
  ],
  authors: [{ name: 'Yurie', url: 'https://yurieblog.vercel.app' }],
  creator: 'Yurie',
  publisher: "Yurie's Blog",
  alternates: {
    canonical: 'https://yurieblog.vercel.app',
  },
  openGraph: {
    title: 'Yurie Blog: Side Hustles & AI Experiments',
    description: 'Honest stories about online experiments, NSFW platforms, and the creator economy.',
    url: 'https://yurieblog.vercel.app',
    siteName: "Yurie's Blog",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/Yurie_main.jpg',
        width: 1200,
        height: 630,
        alt: 'Yurie Blog — Internet Experiments',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yurie Blog: Side Hustles & AI Experiments',
    description: 'Real stories from the creator economy trenches. No gurus, no fluff.',
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
    description: 'Personal blog about online experiments, AI, and creator economy.',
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