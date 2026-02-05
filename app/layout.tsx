// app/layout.tsx — STRIPPED OF AUTH DEPENDENCIES
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ProvidersWrapper } from '@/components/providers-wrapper'
import AnalyticsLazy from '@/components/analytics-lazy'
import CookieBannerClient from '@/components/cookie-banner-client'
import Footer from '@/components/footer'
import { BRAND } from '@/lib/brand-voice'
import SiteHeader from '@/components/site-header'
import Script from 'next/script'
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

// ✅ 100% static metadata
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
  alternates: {
    canonical: BRAND.siteUrl,
  },
  openGraph: {
    title: `${BRAND.siteName} — ${BRAND.taglines.short}`,
    description: BRAND.descriptions.homepage,
    images: [{ 
      url: '/images/Yurie_main.jpg', 
      width: 1200, 
      height: 630, 
      alt: BRAND.siteName 
    }],
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
    googleBot: { 
      index: true, 
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  // ✅ Static Schema.org markup — identical for every request
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BRAND.siteUrl}/#organization`,
    name: BRAND.siteName,
    url: BRAND.siteUrl,
    logo: `${BRAND.siteUrl}/images/Yurie_main.jpg`,
    sameAs: [
      'https://bsky.app/profile/yurieblog.bsky.social',
    ],
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
    image: `${BRAND.siteUrl}/images/Yurie_main.jpg`,
    sameAs: [
      'https://bsky.app/profile/yurieblog.bsky.social',
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
        <Script id="clarity-script" strategy="afterInteractive">
  {`
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "vcpdwg4ap5");
  `}
</Script>
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