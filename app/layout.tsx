// app/layout.tsx
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ProvidersWrapper } from '@/components/providers-wrapper'
import AnalyticsLazy from '@/components/analytics-lazy'
import CookieBannerClient from '@/components/cookie-banner-client'
import Footer from '@/components/footer'
import HeaderWrapper from '@/components/header-wrapper' // Импортируем обертку

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
  description: 'Digital business experiments, creator economy analytics & monetization strategies.',
  authors: [{ name: 'Yurie Jiyūbō', url: siteUrl }],
  creator: 'Yurie Jiyūbō',
  publisher: 'Yurie Jiyūbō', 
  verification: {
    google: 'WXnuGqV3agaGqnSqBJBEuym8I5KkJuvH4AMNKWXodYM',
  },
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Yurie Blog — Digital Entrepreneurship',
    description: 'Personal blog about digital business experiments.',
    images: [{ url: '/images/Yurie_main.jpg', width: 1200, height: 630, alt: 'Yurie Blog' }],
    type: 'website',
    url: siteUrl,
    siteName: 'Yurie Jiyūbō Blog',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yurie Blog',
    description: 'Personal blog about creator economy.',
    images: ['/images/Yurie_main.jpg'],
    creator: '@yurieblog.bsky.social',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
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
    url: siteUrl,
    contactPoint: { '@type': 'ContactPoint', contactType: 'Business Inquiries', url: `${siteUrl}/contact` },
  }

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#author`,
    name: 'Yurie Jiyūbō',
    url: siteUrl,
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
        <ProvidersWrapper>
          <div className="flex flex-col min-h-screen">
            {/* 🟢 Хедер теперь здесь, он будет на всех страницах */}
            <HeaderWrapper />

            <main className="flex-grow">
              {children}
            </main>
            
            {/* Футер здесь */}
            <Footer language="en" />
          </div>
        </ProvidersWrapper>
        <AnalyticsLazy />
        <CookieBannerClient />
      </body>
    </html>
  )
}