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
    // Убрали "NSFW", заменили на бизнес-терминологию
    default: 'Yurie Blog — Digital Business Experiments & Creator Economy Insights',
    template: '%s | Yurie Blog',
  },
  description:
    // Переформулировали: убрали "NSFW", добавили "monetization strategies", "digital entrepreneurship"
    'Personal blog about digital business experiments, monetization strategies, creator economy insights, data-driven content creation, and honest entrepreneurial stories. Real experiences from the trenches of online business.',
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
    // Язык Эзопа: "digital entrepreneurship" вместо "side hustles"
    title: 'Yurie Blog — Digital Entrepreneurship & Creator Economy Data',
    description:
      'Personal blog about digital business experiments, content monetization strategies, creator economy analytics, and data-driven entrepreneurial insights.',
    images: [
      {
        url: '/images/Yurie_main.jpg',
        width: 1200,
        height: 630,
        alt: 'Yurie Blog — Digital Business Experiments',
      },
    ],
    type: 'website',
    url: 'https://yurieblog.vercel.app',
    siteName: "Yurie's Blog",
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yurie Blog — Digital Entrepreneurship & Data Insights',
    description:
      'Personal blog about creator economy experiments, monetization strategies, and data-driven business insights.',
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
  // Изменили категорию на бизнес
  category: 'Business & Entrepreneurship',
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Organization Schema — добавили бизнес-термины */}
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
                contactType: 'Business Inquiries',
                url: 'https://yurieblog.vercel.app/contact',
              },
            }),
          }}
        />

        {/* Person Schema — убрали упоминания "side hustles", заменили на "Digital Entrepreneur" */}
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
              jobTitle: 'Digital Entrepreneur & Content Creator',
              description: 'Digital entrepreneur sharing data-driven insights about online business experiments, creator economy analytics, and digital marketing strategies',
              knowsAbout: [
                'Content Creation',
                'Creator Economy',
                'Digital Marketing',
                'Business Analytics',
                'Web Development',
                'Online Monetization',
                'Digital Entrepreneurship',
                'Data-Driven Content Strategy',
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