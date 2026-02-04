// app/layout.tsx
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ProvidersWrapper } from '@/components/providers-wrapper'
import AnalyticsLazy from '@/components/analytics-lazy'
import CookieBannerClient from '@/components/cookie-banner-client'
import Footer from '@/components/footer'
// ❌ Удаляем статический импорт, чтобы не было конфликта
// import HeaderWrapper from '@/components/header-wrapper' 
import { BRAND } from '@/lib/brand-voice'
import dynamic from 'next/dynamic'
import SiteHeader from '@/components/site-header'



const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: {
    default: BRAND.titles.homepage,
    template: `%s | ${BRAND.siteName}`,
  },
  description: BRAND.descriptions.homepage,
  authors: [{ name: BRAND.authorName, url: BRAND.siteUrl }],
  creator: BRAND.authorName,
  publisher: BRAND.authorName, 
  verification: {
    google: 'WXnuGqV3agaGqnSqBJBEuym8I5KkJuvH4AMNKWXodYM',
  },
  metadataBase: new URL(BRAND.siteUrl),
  openGraph: {
    title: `${BRAND.siteName} — ${BRAND.taglines.short}`,
    description: BRAND.descriptions.homepage,
    images: [{ url: '/images/Yurie_main.jpg', width: 1200, height: 630, alt: BRAND.siteName }],
    type: 'website',
    url: BRAND.siteUrl,
    siteName: BRAND.siteName,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: BRAND.siteName,
    description: BRAND.taglines.medium,
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
  // Я также убрал лишние пробелы в url 'https://schema.org ' -> 'https://schema.org'
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BRAND.siteUrl}/#organization`,
    name: BRAND.siteName,
    url: BRAND.siteUrl,
    contactPoint: { 
      '@type': 'ContactPoint', 
      'contactType': 'Business Inquiries', 
      'url': `${BRAND.siteUrl}/contact` 
    },
  }

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BRAND.siteUrl}/#author`,
    name: BRAND.authorName,
    url: BRAND.siteUrl,
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
            <SiteHeader />
            <main className="flex-grow">
              {children}
            </main>
            <Footer language="en" />
          </div>
        </ProvidersWrapper>
        <AnalyticsLazy />
        <CookieBannerClient />
      </body>
    </html>
  )
}