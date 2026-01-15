import type { Metadata } from 'next'
import Image from 'next/image'
import ArchiveBlogClient from '@/components/archive-blog-client'
import BackToSite from '@/components/back-to-site'
import Breadcrumbs from '@/components/breadcrumbs'

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: 'Blog Archive — Internet Experiments & Side Hustle Stories',
  description: 'Explore the complete collection of real stories about online experiments, NSFW side hustles, AI tools, creator economy, web development, and digital platforms. No BS, just honest experiences.',
  keywords: [
    'blog archive',
    'internet experiments',
    'side hustles',
    'creator economy',
    'NSFW platforms',
    'AI tools',
    'web development',
    'digital experiments',
    'online business',
    'personal blog',
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
    title: 'Blog Archive — Internet Experiments & Side Hustles',
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
    title: 'Blog Archive — Internet Experiments & Side Hustles',
    description: 'Complete collection of real stories and honest experiences.',
    images: [`${siteUrl}/images/Archive_Preview.webp`],
    creator: '@yurieblog.bsky.social',
  },
  category: 'Personal Blog',
}

export default function ArchiveBlogPage() {
  // Enhanced CollectionPage Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteUrl}/archiveblog`,
    name: 'Blog Archive — Internet Experiments & Side Hustles',
    description: 'Complete collection of real stories about online experiments, NSFW side hustles, AI tools, creator economy, and web development',
    url: `${siteUrl}/archiveblog`,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'Blog',
      '@id': `${siteUrl}/#blog`,
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

        {/* Секция Hero: Текст слева, Картинка справа */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
          {/* Блок с текстом */}
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
                NSFW platforms, and online business experiments.
              </p>
            </div>
          </div>

          {/* Блок с картинкой */}
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

        {/* Список постов (Client Component) */}
        <section aria-label="Blog posts archive">
          <ArchiveBlogClient />
        </section>

        {/* Секция Bluesky в стиле About */}
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