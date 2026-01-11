// app/blog/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'
import { createServerSupabase } from '@/lib/supabaseServer'

type Params = { slug: string }

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabase()

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select(`
      slug,
      title,
      excerpt,
      content,
      featured_image,
      created_at,
      updated_at,
      author_id,
      related_slugs
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !post) {
    return { title: 'Post Not Found' }
  }

  const rawText = post.excerpt ?? post.content ?? ''
  const description = rawText
    .replace(/\[(yellow|blue|purple|pink)\]/g, '')
    .replace(/^[> \t]+/gm, '')
    .replace(/[#*`]/g, '')
    .slice(0, 160)
    .trim()

  const imageUrl = post.featured_image ?? 'https://yurieblog.vercel.app/og-image.jpg'

  return {
    title: `${post.title} | Yurie's Blog`,
    description,
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    alternates: {
      canonical: `https://yurieblog.vercel.app/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `https://yurieblog.vercel.app/blog/${post.slug}`,
      siteName: "Yurie's Blog",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.created_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [imageUrl],
      creator: '@yurieblog.bsky.social',
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabase()

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select(`
      id, slug, title, content, excerpt, featured_image, author_id,
      related_slugs, created_at, updated_at, published
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !post) notFound()

  const [{ data: author }, { data: related }] = await Promise.all([
    post.author_id
      ? supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', post.author_id)
          .single()
      : Promise.resolve({ data: null }),

    post.related_slugs && post.related_slugs.length > 0
      ? supabase
          .from('blog_posts')
          .select('id, title, slug, featured_image')
          .in('slug', post.related_slugs)
          .eq('published', true)
      : Promise.resolve({ data: [] }),
  ])

  const normalizedPost = {
    ...post,
    excerpt: post.excerpt ?? '',
    content: post.content ?? '',
  }

  // ✅ Очищаем текст для description
  const cleanDescription = (post.excerpt || post.content || '')
    .replace(/\[(yellow|blue|purple|pink)\]/g, '')
    .replace(/^[> \t]+/gm, '')
    .replace(/[#*`]/g, '')
    .slice(0, 200)
    .trim()

  // ✅ Article JSON-LD
  const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: cleanDescription,
  image: post.featured_image || 'https://yurieblog.vercel.app/og-image.jpg',
  datePublished: post.created_at,
  dateModified: post.updated_at || post.created_at,
  author: {
    '@id': 'https://yurieblog.vercel.app/#author',
  },
  publisher: {
    '@id': 'https://yurieblog.vercel.app/#organization',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://yurieblog.vercel.app/blog/${post.slug}`,
  },
  url: `https://yurieblog.vercel.app/blog/${post.slug}`,
}



  // ✅ Breadcrumbs JSON-LD
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
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://yurieblog.vercel.app/archiveblog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://yurieblog.vercel.app/blog/${post.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <BlogPostClient
        initialPost={normalizedPost}
        initialAuthor={author}
        initialRelatedPosts={related ?? []}
      />
    </>
  )
}