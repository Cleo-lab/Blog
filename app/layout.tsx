// app/layout.tsx
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ProvidersWrapper } from '@/components/providers-wrapper'
import AnalyticsLazy from '@/components/analytics-lazy'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: {
    default: 'Yurie Blog — Internet Experiments, Side Hustles & Real Stories',
    template: '%s | Yurie Blog',
  },
  description:
    'Personal blog about online experiments, NSFW side hustles, AI tools, creator economy, web development, and honest stories about digital platforms. No BS, just real experiences.',
  authors: [{ name: 'Yurie', url: 'https://yurieblog.vercel.app' }],
  creator: 'Yurie',
  publisher: "Yurie's Blog",
  verification: {
    google: 'WXnuGqV3agaGqnSqBJBEuym8I5KkJuvH4AMNKWXodYM',
  },
  metadataBase: new URL('https://yurieblog.vercel.app'),
  alternates: {
    canonical: 'https://yurieblog.vercel.app',
    languages: {
      'en-US': 'https://yurieblog.vercel.app',
    },
  },
  openGraph: {
    title: 'Yurie Blog — Internet Experiments & Side Hustle Stories',
    description:
      'Personal blog about online experiments, NSFW platforms, AI tools, creator economy, and honest stories about digital side hustles.',
    images: [
      {
        url: '/images/Yurie_main.jpg',
        width: 1200,
        height: 630,
        alt: 'Yurie Blog — Internet Experiments',
      },
    ],
    type: 'website',
    url: 'https://yurieblog.vercel.app',
    siteName: "Yurie's Blog",
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yurie Blog — Internet Experiments & Side Hustles',
    description:
      'Personal blog about online experiments, creator economy, and honest stories about digital platforms.',
    images: ['/images/Yurie_main.jpg'],
    site: '@yurieblog.bsky.social',
    creator: '@yurieblog.bsky.social',
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
  category: 'Personal Blog',
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Performance optimization */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* 🧠 Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://yurieblog.vercel.app/#organization',
              name: "Yurie's Blog",
              alternateName: 'Yurie Blog',
              url: 'https://yurieblog.vercel.app',
              logo: {
                '@type': 'ImageObject',
                url: 'https://yurieblog.vercel.app/images/Yurie_main.jpg',
                width: 512,
                height: 512,
              },
              sameAs: [
                'https://bsky.app/profile/yurieblog.bsky.social',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Content Creator',
                url: 'https://yurieblog.vercel.app/contact',
              },
            }),
          }}
        />

        {/* 🧠 Person/Author Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              '@id': 'https://yurieblog.vercel.app/#author',
              name: 'Yurie',
              alternateName: 'Yurie Jiyūbō',
              url: 'https://yurieblog.vercel.app',
              image: {
                '@type': 'ImageObject',
                url: 'https://yurieblog.vercel.app/images/Yurie_main.jpg',
                width: 512,
                height: 512,
              },
              sameAs: [
                'https://bsky.app/profile/yurieblog.bsky.social',
              ],
              jobTitle: 'Content Creator & Blogger',
              description: 'Personal blogger sharing real stories about internet experiments, side hustles, creator economy, and digital platforms',
              knowsAbout: [
                'Content Creation',
                'Creator Economy',
                'Web Development',
                'AI Tools',
                'Digital Platforms',
                'Online Business',
                'Personal Blogging',
              ],
            }),
          }}
        />
      </head>

      <body className={poppins.className}>
        <ProvidersWrapper>{children}</ProvidersWrapper>
        <AnalyticsLazy />
      </body>
    </html>
  )
}