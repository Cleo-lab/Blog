// app/blog/[slug]/page.tsx
import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import BlogPostClient from './BlogPostClient'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Ждем получения slug
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 2. ИСПРАВЛЕНО: используем переменную slug вместо params.slug
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug) 
    .single()

  if (!post) {
    return { title: 'Post Not Found | Yurie Blog' }
  }

  const title = post.title
  const description = (post.excerpt || post.content.substring(0, 160))
    .replace(/[#*`>\[\]]/g, '')
    .trim()
    
  const image = post.featured_image || 'https://yurieblog.vercel.app/og-image.jpg'
  const url = `https://yurieblog.vercel.app/blog/${post.slug}`

  return {
    title: `${title} | Yurie's Blog`,
    description,
    keywords: ['blog', 'personal story', 'Bluesky', post.slug],
    openGraph: {
      title,
      description,
      url,
      siteName: "Yurie's Blog",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: 'article',
      publishedTime: post.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      site: '@yurieblog.bsky.social',
      creator: '@yurieblog.bsky.social',
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // Ждем параметры перед рендерингом
  const { slug } = await params;
  return <BlogPostClient />
}