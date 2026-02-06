import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import BackToSite from '@/components/back-to-site'
import Breadcrumbs from '@/components/breadcrumbs'
import { createServiceSupabase } from '@/lib/supabaseServer'
import { BRAND } from '@/lib/brand-voice'

export const revalidate = 86400 // пересборка каждые 24 часа

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  created_at: string
}

const cleanText = (text: string) => {
  if (!text) return ''
  return text
    .replace(/\[(yellow|blue|purple|pink)\]/g, '')
    .replace(/^[> \t]+/gm, '')
    .replace(/[#*`]/g, '')
    .trim()
}

export const metadata = {
  title: BRAND.titles.blog,
  description: BRAND.descriptions.blog,
  alternates: { canonical: `${BRAND.siteUrl}/blog` },
  openGraph: {
    title: BRAND.titles.blog,
    description: BRAND.taglines.medium,
    url: `${BRAND.siteUrl}/blog`,
    siteName: BRAND.siteName,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BRAND.siteUrl}/images/Archive_Preview.webp`,
        width: 1200,
        height: 630,
        alt: BRAND.headings.blog,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: BRAND.titles.blog,
    description: BRAND.taglines.short,
    images: [`${BRAND.siteUrl}/images/Archive_Preview.webp`],
    creator: '@yurieblog.bsky.social',
  },
}

export default async function BlogPage() {
  const supabase = createServiceSupabase()
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, featured_image, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching posts:', error)
  const blogPosts = (posts || []) as BlogPost[]

  // JSON-LD для CollectionPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${BRAND.siteUrl}/blog`,
    name: BRAND.titles.blog,
    description: BRAND.descriptions.blog,
    url: `${BRAND.siteUrl}/blog`,
    inLanguage: 'en-US',
    isPartOf: { '@type': 'Blog', '@id': `${BRAND.siteUrl}/#blog` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: blogPosts.slice(0, 50).map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${BRAND.siteUrl}/blog/${post.slug}`,
        name: post.title,
      })),
    },
    author: {
      '@type': 'Person',
      '@id': `${BRAND.siteUrl}/#author`,
      name: BRAND.authorName,
      url: BRAND.siteUrl,
    },
  }

  // JSON-LD для Breadcrumb
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BRAND.siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog Archive', item: `${BRAND.siteUrl}/blog` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <Breadcrumbs />

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
          <div className="flex-1 order-2 md:order-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              {BRAND.headings.blog}
            </h1>
            <div className="text-foreground/90 space-y-4 text-lg">
              <p>{BRAND.intros.blog}</p>
            </div>
          </div>

          <div className="flex-1 order-1 md:order-2">
            <Image
              src="/images/Archive_Preview.webp"
              alt={BRAND.headings.blog}
              width={500}
              height={350}
              priority
              className="rounded-2xl shadow-2xl object-cover hover:scale-105 transition-transform duration-500 h-auto"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        <section aria-label="Blog posts archive">
          <h2 className="sr-only">All Blog Posts</h2>

          {blogPosts.length === 0 ? (
            <p className="text-center text-foreground/60">No posts available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {blogPosts.map((post) => (
                <article key={post.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow border-border/50 bg-card h-full flex flex-col">
                    <div className="relative h-48 bg-muted overflow-hidden">
                      <img
                        src={post.featured_image || '/placeholder.svg'}
                        alt={`${post.title} - ${BRAND.siteName} experiment`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width={800}
                        height={450}
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <time className="text-xs text-foreground/60 mb-2 block" dateTime={post.created_at}>
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-foreground/70 text-sm mb-4 line-clamp-3 flex-grow">
                        {cleanText(post.excerpt || post.content.substring(0, 150))}...
                      </p>
                      <Link href={`/blog/${post.slug}`}>
                        <Button size="sm" className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-none">
                          {BRAND.ctas.readMore}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Bluesky Section */}
        <aside className="mt-16 p-6 rounded-2xl bg-[#0085ff]/10 border border-[#0085ff]/30 shadow-sm max-w-3xl">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-foreground">
            Stay updated! 🦋
          </h2>
          <p className="text-lg text-foreground/80 mb-6">
            {BRAND.ctas.followBluesky}
          </p>
          <a
            href="https://bsky.app/profile/yurieblog.bsky.social"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0085ff] text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 active:scale-95"
          >
            Follow @yurieblog
          </a>
        </aside>

        <div className="mt-12">
          <BackToSite />
        </div>
      </main>
    </>
  )
}
