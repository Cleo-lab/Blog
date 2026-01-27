import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import React from 'react'
import { ChevronRight, X } from 'lucide-react'
import { createServiceSupabase } from '@/lib/supabaseServer'
import BlurImage from './blur-image'
import CommentsSection from './comments-section'

// Revalidate каждые 24 часа (не меняй - безопасно для Google)
export const revalidate = 86400

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServiceSupabase()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, content, featured_image, created_at, updated_at')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const rawText = post.excerpt ?? post.content ?? ''
  const description = rawText
    .replace(/\[(yellow|blue|purple|pink)\]/g, '')
    .replace(/^[> \t]+/gm, '')
    .replace(/[#*`]/g, '')
    .slice(0, 160)
    .trim()

  const imageUrl = post.featured_image ?? 'https://yurieblog.vercel.app/images/Yurie_main.jpg'
  const imageAlt = `Featured image for: ${post.title} - Yurie's Blog`

  return {
    title: `${post.title} | Yurie's Blog`,
    description,
    alternates: {
      canonical: `https://yurieblog.vercel.app/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `https://yurieblog.vercel.app/blog/${post.slug}`,
      siteName: "Yurie's Blog",
      locale: 'en_US',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt }],
      publishedTime: post.created_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      authors: ['Yurie'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [imageUrl],
    },
  }
}

/* ---------- HELPERS для цитат (серверные) ---------- */
const collectText = (node: any): string => {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(collectText).join('')
  if (node?.props?.children) return collectText(node.props.children)
  return ''
}

const stripColorTag = (node: any): any => {
  if (typeof node === 'string') return node.replace(/\[(yellow|blue|purple|pink)\]/g, '').trimStart()
  if (Array.isArray(node)) return node.map(stripColorTag)
  if (node?.props?.children) {
    return React.cloneElement(node, {
      ...node.props,
      children: stripColorTag(node.props.children)
    })
  }
  return node
}

const styleMap: Record<string, string> = {
  yellow: 'bg-yellow-300/30 text-yellow-950',
  blue: 'bg-blue-300/25 text-blue-950',
  purple: 'bg-purple-300/25 text-purple-950',
  pink: 'bg-pink-400/20 text-pink-950',
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createServiceSupabase()

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, content, excerpt, featured_image, author_id, created_at, updated_at, related_slugs')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !post) notFound()

  // Параллельная загрузка автора и related posts
  const [{ data: author }, { data: related }] = await Promise.all([
    post.author_id
      ? supabase.from('profiles').select('id, username, avatar_url').eq('id', post.author_id).single()
      : Promise.resolve({ data: null }),
    post.related_slugs && post.related_slugs.length > 0
      ? supabase.from('blog_posts').select('id, title, slug, featured_image').in('slug', post.related_slugs).eq('published', true)
      : Promise.resolve({ data: [] }),
  ])

  // JSON-LD Schema
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `https://yurieblog.vercel.app/blog/${post.slug}#article`,
    headline: post.title,
    description: (post.excerpt || post.content).slice(0, 200),
    image: post.featured_image || 'https://yurieblog.vercel.app/images/Yurie_main.jpg',
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: { '@type': 'Person', name: 'Yurie' },
    publisher: {
      '@type': 'Organization',
      name: "Yurie's Blog",
      logo: { '@type': 'ImageObject', url: 'https://yurieblog.vercel.app/images/Yurie_main.jpg' }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yurieblog.vercel.app/blog/${post.slug}`
    }
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://yurieblog.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://yurieblog.vercel.app/archiveblog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://yurieblog.vercel.app/blog/${post.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-4 py-12">
          
          {/* Breadcrumbs */}
          <nav className="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-pink-500">Home</Link></li>
              <li>/</li>
              <li><Link href="/archiveblog" className="hover:text-pink-500">Blog</Link></li>
              <li>/</li>
              <li className="text-foreground truncate max-w-[200px]">{post.title}</li>
            </ol>
          </nav>

          {/* Close Button */}
          <div className="flex justify-end mb-8">
            <Link href="/archiveblog" className="inline-flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4 mr-2" />
              Close
            </Link>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-12 rounded-3xl overflow-hidden bg-muted shadow-xl text-center">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-auto max-h-[600px] object-contain mx-auto"
              />
            </div>
          )}

          {/* ARTICLE - Серверный рендер для SEO */}
          <article className="mb-12" itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={post.created_at || ''} />
            <meta itemProp="dateModified" content={post.updated_at || post.created_at || ''} />
            
            <h1 className="text-4xl font-bold mb-6" itemProp="headline">{post.title}</h1>
            
            {/* Author Block */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/50">
              <div itemProp="author" itemScope itemType="https://schema.org/Person" className="flex items-center gap-4">
                {author?.avatar_url && (
                  <img 
                    src={author.avatar_url} 
                    className="w-12 h-12 rounded-full border border-pink-500/20" 
                    alt={author.username || 'Author'} 
                    itemProp="image"
                  />
                )}
                <div>
                  <p className="font-semibold text-lg" itemProp="name">
                    {author?.username || 'Yurie'}
                  </p>
                  <time className="text-sm text-muted-foreground" dateTime={post.created_at || undefined}>
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Unknown date'}
                  </time>
                </div>
              </div>
            </div>

            {/* CONTENT - ReactMarkdown с серверным рендером */}
            <div className="prose prose-pink prose-invert max-w-none prose-justify" itemProp="articleBody">
              <ReactMarkdown
                components={{
                  blockquote: ({ children }) => {
                    const fullText = collectText(children)
                    const colorMatch = fullText.match(/\[(yellow|blue|purple|pink)\]/)
                    const color = colorMatch ? colorMatch[1] : 'pink'
                    
                    return (
                      <div className={`my-8 p-8 rounded-[2rem] italic relative ${styleMap[color]}`}>
                        <div className="relative z-10 leading-relaxed text-base font-semibold">
                          {stripColorTag(children)}
                        </div>
                      </div>
                    )
                  },
                  img: BlurImage,
                  code: ({ children }) => (
                    <code className="bg-[#e91e63] text-white px-2 py-0.5 rounded-md font-bold mx-1 italic shadow-sm whitespace-nowrap">
                      {children}
                    </code>
                  ),
                  a: ({ href, children }) => {
                    const isExternal = href?.startsWith('http') && !href.includes('yurieblog.vercel.app')
                    return (
                      <a 
                        href={href} 
                        className="text-pink-500 hover:text-pink-600 underline decoration-pink-500/30 hover:decoration-pink-500 transition-colors"
                        {...(isExternal && { target: "_blank", rel: "noopener noreferrer nofollow" })}
                      >
                        {children}
                      </a>
                    )
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Related Stories - Серверно */}
            {related && related.length > 0 && (
              <div className="mt-16 p-8 bg-muted/20 rounded-3xl border border-border/50">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-pink-500" /> Related Stories
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {related.map((rPost: any) => (
                    <li key={rPost.id}>
                      <Link href={`/blog/${rPost.slug}`} className="block h-full p-4 bg-background rounded-xl border border-border/40 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all">
                        <p className="font-bold text-pink-400 mb-1 italic uppercase text-[10px] tracking-widest">Read Next</p>
                        <p className="text-sm font-semibold">{rPost.title}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          {/* COMMENTS - Клиентский компонент */}
          <CommentsSection postSlug={post.slug} />
          
        </div>
      </div>
    </>
  )
}