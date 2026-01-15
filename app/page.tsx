import type { Metadata } from 'next'
import HomeWrapper from '@/components/home-wrapper'
import HeroServer from '@/components/hero-server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { fetchProfileServer } from '@/lib/profile-server'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Yurie Blog — Real Internet Experiments, Side Hustles & Honest Stories',
  description: 'Personal blog about NSFW side hustles, AI experiments, creator economy fails, web development trials, and what really happens when you try to make money online. No BS, just honest stories.',
  keywords: [
    'personal blog',
    'side hustle stories',
    'creator economy',
    'NSFW platform experience',
    'online experiments',
    'AI tools experiments',
    'web development learning',
    'digital platforms',
    'content creation reality',
    'honest internet stories',
    'adult platform insights',
    'passive income reality',
    'online business experiments'
  ],
  authors: [{ name: 'Yurie', url: 'https://yurieblog.vercel.app' }],
  creator: 'Yurie',
  publisher: "Yurie's Blog",
  alternates: {
    canonical: 'https://yurieblog.vercel.app',
  },
  openGraph: {
    title: 'Yurie Blog — Real Internet Experiments & Side Hustle Stories',
    description: 'Personal blog about online experiments, NSFW platforms, AI tools, creator economy, and honest stories about what really happens when you try digital side hustles.',
    url: 'https://yurieblog.vercel.app',
    siteName: "Yurie's Blog",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/Yurie_main.jpg',
        width: 1200,
        height: 630,
        alt: 'Yurie Blog — Internet Experiments & Side Hustles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yurie Blog — Real Internet Experiments & Side Hustles',
    description: 'Honest stories about online experiments, NSFW platforms, creator economy, AI tools, and digital side hustles. No overnight success stories.',
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

  // Enhanced JSON-LD with BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://yurieblog.vercel.app',
      },
    ],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://yurieblog.vercel.app/#website',
    name: "Yurie's Blog",
    alternateName: 'Yurie Blog — Internet Experiments & Side Hustles',
    url: 'https://yurieblog.vercel.app',
    description: 'Personal blog about online experiments, NSFW side hustles, AI tools, creator economy, web development, and honest stories about digital platforms.',
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      '@id': 'https://yurieblog.vercel.app/#author',
      name: 'Yurie',
      url: 'https://yurieblog.vercel.app',
      image: 'https://yurieblog.vercel.app/images/Yurie_main.jpg',
      sameAs: ['https://bsky.app/profile/yurieblog.bsky.social'],
      description: 'Personal blogger sharing real stories about internet experiments, side hustles, and digital platforms',
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://yurieblog.vercel.app/#organization',
      name: "Yurie's Blog",
      logo: {
        '@type': 'ImageObject',
        url: 'https://yurieblog.vercel.app/images/Yurie_main.jpg',
        width: 512,
        height: 512,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://yurieblog.vercel.app/archiveblog?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // Blog collection
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://yurieblog.vercel.app/#blog',
    name: "Yurie's Blog",
    description: 'Personal blog about online experiments, side hustles, creator economy, and honest internet stories',
    url: 'https://yurieblog.vercel.app',
    inLanguage: 'en-US',
    author: {
      '@id': 'https://yurieblog.vercel.app/#author',
    },
    publisher: {
      '@id': 'https://yurieblog.vercel.app/#organization',
    },
    blogPost: posts?.slice(0, 5).map((post) => ({
      '@type': 'BlogPosting',
      '@id': `https://yurieblog.vercel.app/blog/${post.slug}`,
      headline: post.title,
      url: `https://yurieblog.vercel.app/blog/${post.slug}`,
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      image: post.featured_image || '/images/Yurie_main.jpg',
      author: {
        '@id': 'https://yurieblog.vercel.app/#author',
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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