import { Suspense } from 'react'
import type { Metadata } from 'next'
import HomeWrapper from '@/components/home-wrapper'
import HeroServer from '@/components/hero-server'
import { createServiceSupabase } from '@/lib/supabaseServer'
import { fetchProfileServer } from '@/lib/profile-server'

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  // Добавили имя в заголовок для SEO-релевантности
  title: 'Yurie Blog | Digital Experiments by Yurie Jiyūbō',
  description: 'Digital business experiments, creator economy analytics and monetization strategies by Yurie Jiyūbō.',
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'Yurie Blog: Digital Business & Creator Economy',
    description: 'Data-driven insights into the creator economy by Yurie Jiyūbō.',
    url: siteUrl,
    siteName: 'Yurie Blog',
    type: 'website',
  }
}

export default async function Page() {
  const supabase = createServiceSupabase()
  let posts: any[] = []
  let profile = null

  try {
    const { data: { user } } = await supabase.auth.getUser()
    profile = user ? await fetchProfileServer(user.id) : null

    const { data: postsData } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, content, featured_image, created_at, updated_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(9)

    posts = postsData || []
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  // УСИЛЕННАЯ СХЕМА WEBSITE + PERSON
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: "Yurie Blog", // Без апострофа
        publisher: { '@id': `${siteUrl}/#person` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/archiveblog?search={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: 'Yurie Jiyūbō',
        url: `${siteUrl}/about`,
        image: `${siteUrl}/images/Yurie_main.jpg`,
        sameAs: [
          'https://bsky.app/profile/yurieblog.bsky.social',
          'https://github.com/Cleo-lab'
        ],
        jobTitle: 'Digital Creator & Analyst'
      }
    ]
  }

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${siteUrl}/#blog`,
    name: "Yurie Blog",
    author: { '@id': `${siteUrl}/#person` },
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.created_at,
      author: { '@id': `${siteUrl}/#person` }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
        <HomeWrapper
          initialPosts={posts}
          hero={<HeroServer />}
          initialProfile={profile}
        />
      </Suspense>
    </>
  )
}