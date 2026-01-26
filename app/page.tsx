import type { Metadata } from 'next'
import HomeWrapper from '@/components/home-wrapper'
import HeroServer from '@/components/hero-server'
import { createServiceSupabase } from '@/lib/supabaseServer'
import { fetchProfileServer } from '@/lib/profile-server'
import { Suspense } from 'react'

const siteUrl = 'https://yurieblog.vercel.app'

// Тип для поста
interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  created_at: string
  updated_at: string | null
}

export const metadata: Metadata = {
  title: 'Yurie Blog: Digital Business Experiments & Creator Economy Data',
  description: 'Digital business experiments, creator economy analytics & monetization strategies. Data-driven insights from online entrepreneurship trenches.',
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
  authors: [{ name: 'Yurie', url: siteUrl }],
  creator: 'Yurie',
  publisher: "Yurie's Blog",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Yurie Blog: Digital Business Experiments & Creator Economy',
    description: 'Honest stories about online business experiments, monetization platforms, and the creator economy reality.',
    url: siteUrl,
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

// Revalidate every 24 hours
export const revalidate = 86400

export default async function Page() {
  const supabase = createServiceSupabase()
  
  let posts: BlogPost[] = []
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

    posts = (postsData as BlogPost[]) || []
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  // Only Blog Schema - WebSite is already in layout.tsx
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${siteUrl}/#blog`,
    name: "Yurie's Blog",
    description: 'Personal blog about digital business experiments, creator economy analytics, and data-driven entrepreneurship.',
    url: siteUrl,
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      '@id': `${siteUrl}/#author`,
      name: 'Yurie',
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
    },
    blogPost: posts.slice(0, 5).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      image: post.featured_image || `${siteUrl}/images/Yurie_main.jpg`,
      author: {
        '@type': 'Person',
        '@id': `${siteUrl}/#author`,
        name: 'Yurie',
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <HomeWrapper
          initialPosts={posts}
          hero={<HeroServer />}
          initialProfile={profile}
        />
      </Suspense>
    </>
  )
}