import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'
import { createServerSupabase } from '@/lib/supabaseServer'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabase()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, content, featured_image, created_at')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return { title: 'Post Not Found' }

  // 1. Очищаем текст от кодов [yellow], цитат > и лишних символов для красивого превью
  const rawText = post.excerpt || post.content;
  const description = rawText
    .replace(/\[(yellow|blue|purple|pink)\]/g, '') // Удаляем [yellow] и т.д.
    .replace(/^[> \t]+/gm, '')                    // Удаляем символы цитат >
    .replace(/[#*`]/g, '')                         // Удаляем маркдаун (#, *, `)
    .substring(0, 160)                             // Ограничиваем длину
    .trim();
  
  return {
    title: `${post.title} | Yurie's Blog`,
    description,
    // Подсказка для Google Discover, чтобы он брал большую картинку
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
    alternates: { canonical: `https://yurieblog.vercel.app/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `https://yurieblog.vercel.app/blog/${post.slug}`,
      images: [{ 
        url: post.featured_image || 'https://yurieblog.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
      }],
      type: 'article',
      publishedTime: post.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [post.featured_image || 'https://yurieblog.vercel.app/og-image.jpg'],
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

  // ... остальной код файла без изменений
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
  description: description, // Используем уже очищенное описание
  image: [
    post.featured_image || 'https://yurieblog.vercel.app/og-image.jpg'
  ],
  datePublished: post.created_at,
  dateModified: post.updated_at || post.created_at, // Добавили дату изменения
  author: {
    '@type': 'Person',
    name: author?.username || '✨Yurie✨',
    url: 'https://yurieblog.vercel.app',
  },
  publisher: {
    '@type': 'Organization',
    name: "Yurie's Blog",
    logo: {
      '@type': 'ImageObject',
      url: 'https://yurieblog.vercel.app/Yurie_main.jpg' 
    }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://yurieblog.vercel.app/blog/${post.slug}`,
  },
}

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostClient initialPost={post} initialAuthor={author} initialRelatedPosts={relatedPosts || []} />
    </>
  )
}