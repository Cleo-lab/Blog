import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import BackToSite from '@/components/back-to-site'
import Breadcrumbs from '@/components/breadcrumbs'
import { createServiceSupabase } from '@/lib/supabaseServer'

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: 'Blog Archive – Internet Experiments',
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
    canonical: `${siteUrl}/archiveblog` 
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
  openGraph: {
    title: 'Blog Archive – Internet Experiments & Side Hustles',
    description: 'Complete collection of real stories about online experiments, creator economy, and digital platforms.',
    url: `${siteUrl}/archiveblog`,
    siteName: "Yurie's Blog",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/Archive_Preview.webp`,
        width: 1200,
        height: 630,
        alt: 'Yurie Blog Archive - Internet Experiments & Side Hustles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Archive – Internet Experiments & Side Hustles',
    description: 'Complete collection of real stories and honest experiences.',
    images: [`${siteUrl}/images/Archive_Preview.webp`],
    creator: '@yurieblog.bsky.social',
  },
  category: 'Business & Entrepreneurship',
}

// Revalidate every 24 hours
export const revalidate = 86400

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  created_at: string
}

// Clean text function
const cleanText = (text: string) => {
  if (!text) return ''
  return text
    .replace(/\[(yellow|blue|purple|pink)\]/g, '')
    .replace(/^[> \t]+/gm, '')
    .replace(/[#*`]/g, '')
    .trim()
}

export default async function ArchiveBlogPage() {
  const supabase = createServiceSupabase()
  
  // Fetch all posts on server (SSR)
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, featured_image, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
  }

  const blogPosts = (posts || []) as BlogPost[]

  // Enhanced CollectionPage Schema with ItemList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteUrl}/archiveblog`,
    name: 'Blog Archive – Internet Experiments & Side Hustles',
    description: 'Digital business experiments, creator economy analytics & monetization strategies. Data-driven insights from online entrepreneurship trenches.',
    url: `${siteUrl}/archiveblog`,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'Blog',
      '@id': `${siteUrl}/#blog`,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: blogPosts.slice(0, 50).map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/blog/${post.slug}`,
        name: post.title,
      })),
    },
    author: {
      '@type': 'Person',
      '@id': `${siteUrl}/#author`,
      name: 'Yurie',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: "Yurie's Blog",
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/Yurie_main.jpg`,
        width: 512,
        height: 512,
      },
      url: siteUrl,
    },
    image: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/Archive_Preview.webp`,
      width: 1200,
      height: 630,
    },
  }

  // Breadcrumbs Schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog Archive',
        item: `${siteUrl}/archiveblog`,
      },
    ],
  }

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumbs Component */}
        <Breadcrumbs />

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
          {/* Text Block */}
          <div className="flex-1 order-2 md:order-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Blog Archive
            </h1>
            <div className="text-foreground/90 space-y-4 text-lg">
              <p>
                Welcome to the full library of my digital journey. This is where I store every experiment, 
                failed launch, and successful deep dive about <strong>internet experiments</strong>, <strong>side hustles</strong>, and the <strong>creator economy</strong>.
              </p>
              <p className="text-base text-foreground/60">
                Scroll through the cards below to find specific topics on AI tools, web development, 
                platforms, and online business experiments.
              </p>
            </div>
          </div>

          {/* Image Block */}
          <div className="flex-1 order-1 md:order-2">
            <Image
              src="/images/Archive_Preview.webp"
              alt="Yurie Blog Archive - Complete collection of internet experiments and side hustle stories"
              width={500}
              height={350}
              priority
              className="rounded-2xl shadow-2xl object-cover hover:scale-105 transition-transform duration-500 h-auto"
            />
          </div>
        </div>

        {/* Blog Posts Grid - Server Side Rendered */}
        <section aria-label="Blog posts archive">
          <h2 className="sr-only">All Blog Posts</h2>
          
          {blogPosts.length === 0 ? (
            <p className="text-center text-foreground/60">No posts available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {blogPosts.map((post) => (
                <article key={post.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow border-border/50 bg-card h-full">
                    <div className="relative h-48 bg-muted overflow-hidden">
                      <img
                        src={post.featured_image || '/placeholder.svg'}
                        // ✅ УНИКАЛЬНЫЙ alt для каждой статьи
                        alt={`${post.title} - Digital business experiment and creator economy insight from Yurie's Blog`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        // ✅ Добавляем width и height для SEO
                        width={800}
                        height={450}
                      />
                    </div>
                    <div className="p-4">
                      <time className="text-xs text-foreground/60 mb-2 block" dateTime={post.created_at}>
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        <Link 
                          href={`/blog/${post.slug}`} 
                          className="hover:text-primary transition-colors"
                          // ✅ Добавляем aria-label для доступности
                          aria-label={`Read article: ${post.title}`}
                        >
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-foreground/70 text-sm mb-4 line-clamp-3">
                        {cleanText(post.excerpt || post.content.substring(0, 150))}...
                      </p>

                      <Link href={`/blog/${post.slug}`}>
                        <Button 
                          size="sm" 
                          className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-none"
                          aria-label={`Read more about ${post.title}`}
                        >
                          Read More
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
            Stay updated! <span className="text-2xl" role="img" aria-label="butterfly">🦋</span>
          </h2>
          <p className="text-lg text-foreground/80 mb-6">
            Don't miss new experiments. I post live results and thoughts daily on Bluesky.
          </p>
          <a
            href="https://bsky.app/profile/yurieblog.bsky.social"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0085ff] text-white rounded-xl hover:bg-[#0070d6] transition-all font-bold shadow-lg shadow-blue-500/25 active:scale-95"
            style={{ backgroundColor: '#0085ff', color: 'white' }}
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