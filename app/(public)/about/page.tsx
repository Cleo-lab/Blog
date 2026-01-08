import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: 'About Yurie — Experiments, Side Hustles & The Internet',
  description:
    'Personal blog about online experiments, creator economy, adult platforms, AI tools, and web development. Real data, real mistakes, no gurus.',
  keywords: 'personal blog, creator economy, web development, AI experiments, side hustles, digital creator, honest blogging',
  authors: [{ name: 'Yurie', url: siteUrl }],
  creator: 'Yurie',
  publisher: "Yurie's Blog",
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'About Yurie — Experiments, Side Hustles & The Internet',
    description: 'Real data, real mistakes, no gurus. Get to know the author behind the experiments.',
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
    title: 'About Yurie — Experiments, Side Hustles & The Internet',
    description: 'Real data, real mistakes, no gurus.',
    images: [`${siteUrl}/images/About.webp`],
    creator: '@yurieblog.bsky.social',
  },
}

export default function AboutPage() {
  // Schema.org Person markup для Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Yurie',
    url: siteUrl,
    image: `${siteUrl}/Yurie_main.jpg`,
    description: 'Digital creator and blogger writing about online experiments, creator economy, and web development',
    sameAs: [
      'https://bsky.app/profile/yurieblog.bsky.social',
    ],
    knowsAbout: [
      'Web Development',
      'AI Tools',
      'Creator Economy',
      'Content Creation',
      'Digital Experiments',
    ],
    email: 'cleopatrathequeenofcats@gmail.com',
    jobTitle: 'Digital Creator & Blogger',
    worksFor: {
      '@type': 'Organization',
      name: "Yurie's Blog",
      url: siteUrl,
    },
  }

  // Breadcrumbs для навигации
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

      <main className="max-w-3xl mx-auto px-4 py-10">
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
              <span className="text-foreground font-medium">About</span>
            </li>
          </ol>
        </nav>

        <article>
          <Image
            src="/images/About.webp"
            alt="Yurie — personal blog author and digital creator"
            width={768}
            height={320}
            priority
            className="w-full h-auto object-contain rounded-2xl mb-6 shadow-lg"
          />
          
          <h1 className="text-3xl font-bold mb-4">
            About Yurie — Personal Blog & Internet Experiments
          </h1>

          <div className="space-y-4 text-foreground/90">
            <p>
              Hi! I'm Yurie! This is{' '}
              <Link 
                href="/" 
                className="underline text-purple-600 hover:text-pink-500 transition-colors font-medium"
              >
                my personal blog
              </Link>{' '}
              about online experiments, side hustles, and learning how the internet actually works - not how influencers pretend it does.
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

          <aside className="mt-6 p-4 bg-muted/30 rounded-xl border-l-4 border-primary">
            <p className="italic">
              No gurus. No courses. No fake success stories.<br />
              Just experiments, data, mistakes, and lessons learned in public.
            </p>
          </aside>

          {/* Bluesky Connect Section */}
          <section className="mt-12 p-6 rounded-2xl bg-[#0085ff]/10 border border-[#0085ff]/30 shadow-sm">
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
        </article>
      </main>
    </>
  )
}