// app/layout.tsx
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ProvidersWrapper } from '@/components/providers-wrapper'
import AnalyticsLazy from '@/components/analytics-lazy'
import CookieBannerClient from '@/components/cookie-banner-client'
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: {
    default: 'Yurie Blog — Digital Business Experiments by Yurie Jiyūbō',
    template: '%s | Yurie Jiyūbō',
  },
  description: 'Digital business experiments, creator economy analytics & monetization strategies. Data-driven insights from online entrepreneurship trenches.',
  authors: [{ name: 'Yurie Jiyūbō', url: siteUrl }],
  creator: 'Yurie Jiyūbō',
  publisher: 'Yurie Jiyūbō', 
  verification: {
    google: 'WXnuGqV3agaGqnSqBJBEuym8I5KkJuvH4AMNKWXodYM',
  },
  metadataBase: new URL(siteUrl),
  
  openGraph: {
    title: 'Yurie Blog — Digital Entrepreneurship & Creator Economy Data',
    description: 'Personal blog about digital business experiments, content monetization strategies, and data-driven entrepreneurial insights.',
    images: [
      {
        url: '/images/Yurie_main.jpg',
        width: 1200,
        height: 630,
        alt: 'Yurie Blog by Yurie Jiyūbō',
      },
    ],
    type: 'website',
    url: siteUrl,
    siteName: 'Yurie Jiyūbō Blog',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yurie Blog — Digital Entrepreneurship & Data Insights',
    description: 'Personal blog about creator economy experiments and monetization strategies.',
    images: ['/images/Yurie_main.jpg'],
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
  category: 'Business & Entrepreneurship',
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: "Yurie's Blog",
    alternateName: 'Yurie Blog',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/Yurie_main.jpg`,
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://bsky.app/profile/yurieblog.bsky.social',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Business Inquiries',
      url: `${siteUrl}/contact`,
    },
  }

  const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteUrl}/#author`,
  name: 'Yurie Jiyūbō',
  alternateName: 'Yurie',
  url: siteUrl,
  image: {
    '@type': 'ImageObject',
    url: `${siteUrl}/images/Yurie_main.jpg`,
  },
  sameAs: [
    'https://bsky.app/profile/yurieblog.bsky.social',
    'https://github.com/Cleo-lab',
  ],
  jobTitle: 'Digital Entrepreneur & Content Creator',
  description: 'Personal blog about creator economy experiments and monetization strategies.',
  knowsAbout: [
    'Digital Business Experiments', 
    'Creator Economy Analytics',
    'Content Monetization Strategy',
    'Digital Marketing',
    'Entrepreneurship',
  ],
}

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>

      <body className={poppins.className}>
  <ProvidersWrapper>{children}</ProvidersWrapper>
  <AnalyticsLazy />
  <CookieBannerClient />
</body>

    </html>
  )
}