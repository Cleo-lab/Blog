import type { Metadata } from 'next'
import HeroServer from '@/components/hero-server'
import { createServiceSupabase } from '@/lib/supabaseServer'
import { fetchProfileServer } from '@/lib/profile-server'
import Link from 'next/link'
import Image from 'next/image'

const siteUrl = 'https://yurieblog.vercel.app'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
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
      .select('id, title, slug, excerpt, featured_image, created_at, updated_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(9)

    posts = (postsData as BlogPost[]) || []
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${siteUrl}/#blog`,
    name: "Yurie's Blog",
    url: siteUrl,
    blogPost: posts.slice(0, 5).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      image: post.featured_image || `${siteUrl}/images/Yurie_main.jpg`,
      author: {
        '@type': 'Person',
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

      {/* Hero Section */}
      <HeroServer />

      {/* Posts Grid - SSR для Google */}
      <section className="max-w-6xl mx-auto px-4 py-12" aria-label="Latest blog posts">
        <h2 className="sr-only">Latest Articles</h2>
        
        {posts.length === 0 ? (
          <p className="text-center text-foreground/60">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative h-48 bg-muted rounded-lg overflow-hidden mb-4">
                    {post.featured_image ? (
                      <Image
                        src={post.featured_image}
                        alt={`${post.title} - Digital business experiment from Yurie's Blog`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                        <span className="text-4xl">📝</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-foreground/70 mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <time className="text-xs text-muted-foreground mt-2 block">
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* View All Link */}
      <div className="text-center pb-12">
        <Link 
          href="/archiveblog" 
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          View All Articles
        </Link>
      </div>
    </>
  )
}