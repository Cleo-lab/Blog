import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'
import { createServerSupabase } from '@/lib/supabaseServer'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabase()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, content, featured_image, created_at') // ✅ Добавили slug в выборку
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return { title: 'Post Not Found' }

  // Находим эту строку:
// const description = (post.excerpt || post.content).substring(0, 160).replace(/[#*`>\[\]]/g, '').trim()

// И меняем на этот вариант:
const rawText = post.excerpt || post.content;
const description = rawText
  .replace(/\[(yellow|blue|purple|pink)\]/g, '') // Удаляем теги цветов
  .replace(/^[> \t]+/gm, '')                    // Удаляем символы цитат
  .replace(/[#*`]/g, '')                         // Удаляем маркдаун-символы
  .substring(0, 160)                             // Ограничиваем длину для SEO
  .trim();
  
  return {
    title: `${post.title} | Yurie's Blog`,
    description,
    alternates: { canonical: `https://yurieblog.vercel.app/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `https://yurieblog.vercel.app/blog/${post.slug}`, // Теперь post.slug не будет undefined
      images: [{ 
        url: post.featured_image || 'https://yurieblog.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
      }],
      type: 'article',
      publishedTime: post.created_at,
    },
    // Добавим для Twitter, так как он часто капризничает
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