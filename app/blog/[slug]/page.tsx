import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'
import { createServerSupabase } from '@/lib/supabaseServer'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabase()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, content, featured_image, created_at')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return { title: 'Post Not Found' }

  const description = (post.excerpt || post.content).substring(0, 160).replace(/[#*`>\[\]]/g, '').trim()
  return {
    title: `${post.title} | Yurie's Blog`,
    description,
    alternates: { canonical: `https://yurieblog.vercel.app/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `https://yurieblog.vercel.app/blog/${post.slug}`,
      images: [{ url: post.featured_image || 'https://yurieblog.vercel.app/og-image.jpg' }],
      type: 'article',
      publishedTime: post.created_at,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabase()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  const [{ data: author }, { data: relatedPosts }] = await Promise.all([
    supabase.from('profiles').select('id, username, avatar_url').eq('id', post.author_id).single(),
    post.related_slugs?.length
      ? supabase.from('blog_posts').select('id, title, slug, featured_image').in('slug', post.related_slugs).eq('published', true)
      : Promise.resolve({ data: [] }),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content.substring(0, 150),
    image: post.featured_image || 'https://yurieblog.vercel.app/og-image.jpg',
    datePublished: post.created_at,
    author: {
      '@type': 'Person',
      name: author?.username || '✨Yurie✨',
      url: 'https://yurieblog.vercel.app',
    },
    url: `https://yurieblog.vercel.app/blog/${post.slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostClient initialPost={post} initialAuthor={author} initialRelatedPosts={relatedPosts || []} />
    </>
  )
}