import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ArchiveBlogClient from '@/components/archive-blog-client'
import BackToSite from '@/components/back-to-site'

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: 'Blog Archive — Yurie Jiyūbū',
  description: 'Explore the full collection of stories, digital experiments, and creative insights by Yurie. Articles on AI, web development, and the creator economy.',
  keywords: 'blog, AI, web development, creator economy, digital experiments, Yurie',
  authors: [{ name: 'Yurie', url: siteUrl }],
  creator: 'Yurie',
  publisher: "Yurie's Blog",
  alternates: { 
    canonical: `${siteUrl}/archiveblog` 
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
  openGraph: {
    title: 'Blog Archive — Yurie Jiyūbū',
    description: 'Explore the full collection of stories, digital experiments, and creative insights by Yurie.',
    url: `${siteUrl}/archiveblog`,
    siteName: "Yurie's Blog",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/Archive_Preview.webp`,
        width: 1200,
        height: 630,
        alt: 'Yurie Blog Archive Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Archive — Yurie Jiyūbū',
    description: 'Explore the full collection of stories and creative insights.',
    images: [`${siteUrl}/images/Archive_Preview.webp`],
    creator: '@yurieblog.bsky.social',
  },
}

export default function ArchiveBlogPage() {
  // Schema.org structured data для Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog Archive — Yurie Jiyūbū',
    description: 'Explore the full collection of stories, digital experiments, and creative insights by Yurie.',
    url: `${siteUrl}/archiveblog`,
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: 'Yurie',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: "Yurie's Blog",
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/Yurie_main.jpg`,
      },
      url: siteUrl,
    },
    image: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/Archive_Preview.webp`,
      width: 1200,
      height: 630,
    },
    breadcrumb: {
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
    },
  }

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumbs для SEO */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-pink-500 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-foreground font-medium">Blog Archive</span>
            </li>
          </ol>
        </nav>

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
                failed launch, and successful deep dive originally featured on{' '}
                <Link 
                  href="/" 
                  className="underline text-purple-600 hover:text-pink-500 transition-colors font-medium"
                >
                  my main page
                </Link>.
              </p>
              <p className="text-base text-foreground/60">
                Scroll through the cards below to find specific topics on AI, web development, 
                and the creator economy.
              </p>
            </div>
          </div>

          {/* Блок с картинкой */}
          <div className="flex-1 order-1 md:order-2">
            <Image 
              src="/images/Archive_Preview.webp" 
              alt="Yurie Blog Archive - Digital experiments and creative insights" 
              width={500} 
              height={350}
              priority
              className="rounded-2xl shadow-2xl object-cover hover:scale-105 transition-transform duration-500"
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