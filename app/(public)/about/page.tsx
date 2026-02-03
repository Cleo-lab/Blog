import type { Metadata } from 'next'
import Image from 'next/image'
import SupportButton from '@/components/support-button'
import Breadcrumbs from '@/components/breadcrumbs'
import { BRAND, getSchemaDescription } from '@/lib/brand-voice'

export const metadata: Metadata = {
  title: BRAND.titles.about,
  description: BRAND.descriptions.about,
  
  keywords: [
    'digital experiment blog',
    'creator economy stories',
    'honest online business',
    'side hustle documentation',
    'web development experiments',
    'AI tools testing',
    'digital creator',
    'real entrepreneurship stories',
  ],
  
  authors: [{ name: BRAND.authorName, url: BRAND.siteUrl }],
  creator: BRAND.authorName,
  publisher: BRAND.authorName,
  
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
    canonical: `${BRAND.siteUrl}/about`,
  },
  
  openGraph: {
    title: 'About Yurie — The Person Behind Digital Experiments',
    description: 'Real stories about online experiments that actually happened. From successful projects to spectacular failures. No BS, just honest documentation.',
    url: `${BRAND.siteUrl}/about`,
    siteName: BRAND.siteName,
    locale: 'en_US',
    type: 'profile',
    images: [
      {
        url: `${BRAND.siteUrl}/images/About.webp`,
        width: 1200,
        height: 630,
        alt: 'About Yurie — Digital experimenter, side hustle enthusiast, chaos documenter',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'About Yurie — Digital Experiments & Side Hustle Stories',
    description: 'Real data, real failures, real wins. Zero motivational BS.',
    images: [`${BRAND.siteUrl}/images/About.webp`],
    creator: '@yurieblog.bsky.social',
  },
  
  category: 'Personal Blog',
}

export default function AboutPage() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BRAND.siteUrl}/#author`,
    name: BRAND.authorName,
    alternateName: 'Yurie',
    givenName: 'Yurie',
    familyName: 'Jiyūbō',
    url: BRAND.siteUrl,
    image: {
      '@type': 'ImageObject',
      url: `${BRAND.siteUrl}/images/Yurie_main.jpg`,
      width: 512,
      height: 512,
    },
    description: getSchemaDescription('about'),
    sameAs: [
      'https://bsky.app/profile/yurieblog.bsky.social',
      'https://github.com/Cleo-lab',
    ],
    knowsAbout: [
      'Digital Business Experiments',
      'Creator Economy',
      'Online Monetization',
      'Content Strategy',
      'Web Development',
      'AI Tools',
      'Side Hustles',
      'Digital Marketing',
    ],
    email: 'cleopatrathequeenofcats@gmail.com',
    jobTitle: 'Digital Experimenter & Chaos Documenter',
    worksFor: {
      '@type': 'Organization',
      '@id': `${BRAND.siteUrl}/#organization`,
      name: BRAND.siteName,
      url: BRAND.siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'ProfilePage',
      '@id': `${BRAND.siteUrl}/about`,
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BRAND.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: `${BRAND.siteUrl}/about`,
      },
    ],
  }

  const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${BRAND.siteUrl}/about`,
    name: 'About Yurie',
    description: getSchemaDescription('about'),
    url: `${BRAND.siteUrl}/about`,
    mainEntity: {
      '@id': `${BRAND.siteUrl}/#author`,
    },
    inLanguage: 'en-US',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
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
        <Breadcrumbs />

        <div className="flex flex-col md:flex-row md:items-start gap-10 mb-12">
          <div className="flex-1 order-2 md:order-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              About Yurie — The Person Behind These Digital Experiments
            </h1>
            
            <div className="text-foreground/90 space-y-4 text-lg text-justify">
              <p>
                Hi! I'm <strong>Yurie</strong>, and this is my digital experiment log disguised as a blog.
              </p>
              
              <p>
                I document <strong>real attempts</strong> at building online projects, navigating the <strong>creator economy</strong>, 
                and figuring out how digital monetization actually works — not through guru courses, 
                but through trial, error, and occasional accidental success.
              </p>
              
              <p>
                Here you'll find stories about <strong>AI tools</strong> I've tested, <strong>web projects</strong> I've built, 
                <strong>side hustles</strong> I've attempted, and platforms I've experimented with 
                (some brilliant, some questionable, all documented).
              </p>
              
              <p>
                This isn't about overnight success or passive income promises. 
                It's about <strong>honest documentation</strong> of what happens when you actually try things: 
                failed launches that taught valuable lessons, unexpected growth that made no sense, 
                account bans that were probably deserved, analytics spikes that came from nowhere, 
                and UX decisions that seemed smart at 2 AM.
              </p>
              
              <p>
                If you're into <strong>real experiments</strong>, <strong>honest storytelling</strong>, 
                and learning from both wins and failures — you're in the right place. 
                No motivational quotes, no guru BS, just documented chaos with data.
              </p>
            </div>
          </div>

          <div className="flex-1 order-1 md:order-2 flex flex-col gap-6">
            <Image
              src="/images/About.webp"
              alt="Yurie — documenting digital experiments, one failure at a time"
              width={500}
              height={350}
              priority
              className="rounded-2xl shadow-2xl object-cover hover:scale-105 transition-transform duration-500 h-auto"
            />

            <section className="p-6 rounded-2xl bg-[#0085ff]/10 border border-[#0085ff]/30 shadow-sm">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-foreground">
                Daily experiment updates 🦋
              </h2>
              <p className="text-lg text-foreground/80 mb-6">
                Real-time updates on digital chaos, creator economy insights, and whatever I'm currently breaking.
              </p>
              <a
                href="https://bsky.app/profile/yurieblog.bsky.social"
                target="_blank"
                rel="noopener noreferrer me"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0085ff] text-white rounded-xl hover:bg-[#0070d6] transition-all font-bold shadow-lg shadow-blue-500/25 active:scale-95"
              >
                {BRAND.ctas.followBluesky}
              </a>
            </section>

            <aside className="hidden md:block p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 border-l-4 border-pink-500 shadow-lg">
              <p className="text-lg md:text-xl text-foreground mb-4 text-justify">
                Unfortunately, <strong>Elon Musk</strong> still hasn't discovered this blog, 
                and I blocked <strong>Bill Gates</strong> preemptively (just in case). 
                So venture capital isn't happening anytime soon. 😄
              </p>
              <p className="text-lg text-foreground/70 mb-4">
                But if you want to support these experiments:
              </p>
              <SupportButton />
            </aside>
          </div>
        </div>

        <aside className="block md:hidden p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 border-l-4 border-pink-500 shadow-lg mb-10">
          <p className="text-lg text-foreground mb-4 text-justify">
            Unfortunately, <strong>Elon Musk</strong> still hasn't discovered this blog, 
            and I blocked <strong>Bill Gates</strong> preemptively. 
            So venture capital isn't happening anytime soon. 😄
          </p>
          <p className="text-lg text-foreground/70 mb-4">
            But if you want to support these experiments:
          </p>
          <SupportButton />
        </aside>

        <footer className="mt-8 text-sm text-foreground/60 border-t border-border/50 pt-6">
          <p>
            For collaboration inquiries, experiment discussions, or just to say hi:{' '}
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