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
    default: 'Yurie Jiyūbō - Character Blog',
    template: '%s | Yurie Jiyūbō',
  },
  description:
    'Personal blog of Yurie Jiyūbō — anime characters, digital dreams, and cozy creativity.',
  authors: [{ name: 'Yurie Jiyūbō', url: 'https://yurieblog.vercel.app' }],
  creator: 'Yurie Jiyūbō',
  publisher: 'Yurie Jiyūbō',
  verification: {
    google: 'WXnuGqV3agaGqnSqBJBEuym8I5KkJuvH4AMNKWXodYM',
  },
  metadataBase: new URL('https://yurieblog.vercel.app'),
  alternates: {
    canonical: 'https://yurieblog.vercel.app',
  },
  openGraph: {
    title: 'Yurie Jiyūbō - Character Blog',
    description:
      'Personal blog of Yurie Jiyūbō — anime characters, digital dreams, and cozy creativity.',
    images: ['/images/Yurie_main.jpg'],
    type: 'website',
    url: 'https://yurieblog.vercel.app',
    siteName: "Yurie's Blog",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yurie Jiyūbō - Character Blog',
    description:
      'Personal blog of Yurie Jiyūbō — anime characters, digital dreams, and cozy creativity.',
    images: ['/images/Yurie_main.jpg'],
    site: '@yurieblog.bsky.social',
    creator: '@yurieblog.bsky.social',
  },
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* perf */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* 🧠 Organization entity */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://yurieblog.vercel.app/#organization',
              name: "Yurie's Blog",
              url: 'https://yurieblog.vercel.app',
              logo: {
                '@type': 'ImageObject',
                url: 'https://yurieblog.vercel.app/images/Yurie_main.jpg',
              },
            }),
          }}
        />

        {/* 🧠 Author entity */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              '@id': 'https://yurieblog.vercel.app/#author',
              name: 'Yurie Jiyūbō',
              url: 'https://yurieblog.vercel.app',
              image: 'https://yurieblog.vercel.app/images/Yurie_main.jpg',
              sameAs: [
                'https://bsky.app/profile/yurieblog.bsky.social',
              ],
            }),
          }}
        />
      </head>

      <body className={poppins.className}>
        <ProvidersWrapper>{children}</ProvidersWrapper>
        <AnalyticsLazy /> {/* лениво, не блокирует */}
      </body>
    </html>
  )
}
