import type { Metadata } from 'next'
import Image from 'next/image'
import SupportButton from '@/components/support-button'
import Breadcrumbs from '@/components/breadcrumbs'

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: 'About Yurie — Internet Experiments, Side Hustles & Real Stories',
  description:
    'Personal blog about online experiments, NSFW side hustles, creator economy, AI tools, and web development. Real data, real mistakes, no gurus.',
  keywords: [
    'personal blog',
    'creator economy',
    'web development',
    'AI experiments',
    'side hustles',
    'NSFW platforms',
    'digital creator',
    'honest blogging',
    'online experiments',
    'content creation',
  ],
  authors: [{ name: 'Yurie', url: siteUrl }],
  creator: 'Yurie',
  publisher: "Yurie's Blog",
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
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'About Yurie — Internet Experiments & Side Hustles',
    description: 'Real stories about online experiments, creator economy, and digital platforms. No BS, just honest experiences.',
    url: `${siteUrl}/about`,
    siteName: "Yurie's Blog",
    locale: 'en_US',
    type: 'profile',
    images: [
      {
        url: `${siteUrl}/images/About.webp`,
        width: 1200,
        height: 630,
        alt: 'About Yurie - Personal blog author and digital creator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Yurie — Internet Experiments & Side Hustles',
    description: 'Real data, real mistakes, no gurus.',
    images: [`${siteUrl}/images/About.webp`],
    creator: '@yurieblog.bsky.social',
  },
  category: 'Personal Blog',
}

export default function AboutPage() {
  // Enhanced Person Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#author`,
    name: 'Yurie',
    alternateName: 'Yurie Jiyūbō',
    url: siteUrl,
    image: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/Yurie_main.jpg`,
      width: 512,
      height: 512,
    },
    description: 'Digital creator and blogger sharing real stories about online experiments, NSFW side hustles, creator economy, AI tools, and web development',
    sameAs: [
      'https://bsky.app/profile/yurieblog.bsky.social',
    ],
    knowsAbout: [
      'Web Development',
      'AI Tools',
      'Creator Economy',
      'Content Creation',
      'Digital Experiments',
      'NSFW Platforms',
      'Online Business',
      'Personal Blogging',
    ],
    email: 'cleopatrathequeenofcats@gmail.com',
    jobTitle: 'Digital Creator & Blogger',
    worksFor: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: "Yurie's Blog",
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'ProfilePage',
      '@id': `${siteUrl}/about`,
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
        name: 'About',
        item: `${siteUrl}/about`,
      },
    ],
  }

  // AboutPage Schema
  const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${siteUrl}/about`,
    name: 'About Yurie',
    description: 'Learn about Yurie and the blog focused on internet experiments, side hustles, and creator economy',
    url: `${siteUrl}/about`,
    mainEntity: {
      '@id': `${siteUrl}/#author`,
    },
    inLanguage: 'en-US',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumbs Component */}
        <Breadcrumbs />

        {/* Hero + Support блок */}
        <div className="flex flex-col md:flex-row md:items-start gap-10 mb-12">
          {/* текст слева */}
          <div className="flex-1 order-2 md:order-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              About Yurie — Personal Blog & Internet Experiments
            </h1>
            <div className="text-foreground/90 space-y-4 text-lg text-justify text-wrap balance">
              <p>
                Hi! I'm Yurie! This is my personal blog about online experiments, side hustles, and learning how the internet actually works — not how influencers pretend it does.
              </p>
              <p>
                Here I write about building projects from scratch, the <strong>creator economy</strong>, adult platforms, <strong>AI tools</strong>, <strong>web development</strong>, and what happens when curiosity meets algorithms. Some stories are funny, some are uncomfortable, and some accidentally turn into technical deep dives.
              </p>
              <p>
                This blog is not about overnight success, passive income, or motivational quotes. It's about <strong>real experiences</strong>: failed ideas, unexpected growth, account bans, analytics spikes, bad UX decisions, and figuring things out by trial and error.
              </p>
              <p>
                If you're interested in personal blogging, digital platforms, content creation, AI experiments, web development, and honest storytelling about the modern internet — you're in the right place.
              </p>
            </div>
          </div>

          {/* картинка + Bluesky + Support блок для десктопа */}
          <div className="flex-1 order-1 md:order-2 flex flex-col gap-6">
            <Image
              src="/images/About.webp"
              alt="Yurie — personal blog author sharing stories about internet experiments and side hustles"
              width={500}
              height={350}
              priority
              className="rounded-2xl shadow-2xl object-cover hover:scale-105 transition-transform duration-500 h-auto"
              style={{ height: 'auto' }}
            />

            <section className="p-6 rounded-2xl bg-[#0085ff]/10 border border-[#0085ff]/30 shadow-sm">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-foreground">
                Let's connect! <span className="text-2xl" role="img" aria-label="butterfly">🦋</span>
              </h2>
              <p className="text-lg text-foreground/80 mb-6">
                I share real-time updates on my experiments and deep dives into the creator economy on Bluesky.
              </p>
              <a
                href="https://bsky.app/profile/yurieblog.bsky.social"
                target="_blank"
                rel="noopener noreferrer me"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0085ff] text-white rounded-xl hover:bg-[#0070d6] transition-all font-bold shadow-lg shadow-blue-500/25 active:scale-95"
                style={{ backgroundColor: '#0085ff', color: 'white' }}
              >
                Follow @yurieblog on Bluesky
              </a>
            </section>

            {/* Support-Block для десктопа */}
            <aside className="hidden md:block p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 border-l-4 border-pink-500 shadow-lg">
              <p className="text-lg md:text-xl text-foreground mb-4 text-justify">
                Unfortunately, <strong>Elon Musk</strong> still hasn't heard about my blog, and I blocked <strong>Bill Gates</strong> in advance, just to make sure he never finds out 😄
              </p>
              <p className="text-lg text-foreground/70 mb-4">
                So, if you wanna support my project, hit it up right here:
              </p>
              <SupportButton />
            </aside>
          </div>
        </div>

        {/* Support-Block для мобильных */}
        <aside className="block md:hidden p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 border-l-4 border-pink-500 shadow-lg mb-10">
          <p className="text-lg md:text-xl text-foreground mb-4 text-justify">
            Unfortunately, <strong>Elon Musk</strong> still hasn't heard about my blog, and I blocked <strong>Bill Gates</strong> in advance, just to make sure he never finds out 😄
          </p>
          <p className="text-lg text-foreground/70 mb-4">
            So, if you wanna support my project, hit it up right here:
          </p>
          <SupportButton />
        </aside>

        {/* Contact footer */}
        <footer className="mt-8 text-sm text-foreground/60 border-t border-border/50 pt-6">
          <p>
            Contact for collaborations or questions:{' '}
            <a
              href="mailto:cleopatrathequeenofcats@gmail.com"
              className="underline hover:text-primary transition-colors"
              rel="noopener"
            >
              cleopatrathequeenofcats@gmail.com
            </a>
          </p>
        </footer>
      </main>
    </>
  )
}