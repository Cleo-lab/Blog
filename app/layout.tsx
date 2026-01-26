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

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: {
    default: 'Yurie Blog — Digital Business Experiments & Creator Economy Insights',
    template: '%s | Yurie Blog',
  },
  description: 'Digital business experiments, creator economy analytics & monetization strategies. Data-driven insights from online entrepreneurship trenches.',
  authors: [{ name: 'Yurie', url: siteUrl }],
  creator: 'Yurie',
  publisher: "Yurie's Blog",
  verification: {
    google: 'WXnuGqV3agaGqnSqBJBEuym8I5KkJuvH4AMNKWXodYM',
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-US': siteUrl,
    },
  },
  openGraph: {
    title: 'Yurie Blog — Digital Entrepreneurship & Creator Economy Data',
    description: 'Personal blog about digital business experiments, content monetization strategies, creator economy analytics, and data-driven entrepreneurial insights.',
    images: [
      {
        url: '/images/Yurie_main.jpg',
        width: 1200,
        height: 630,
        alt: 'Yurie Blog — Digital Business Experiments',
      },
    ],
    type: 'website',
    url: siteUrl,
    siteName: "Yurie's Blog",
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yurie Blog — Digital Entrepreneurship & Data Insights',
    description: 'Personal blog about creator economy experiments, monetization strategies, and data-driven business insights.',
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
  category: 'Business & Entrepreneurship',
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  // WebSite Schema — помогает Google понять структуру сайта
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: "Yurie's Blog",
    description: 'Digital business experiments, creator economy insights & online monetization strategies',
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: "Yurie's Blog",
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/Yurie_main.jpg`,
        width: 512,
        height: 512,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/archiveblog?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    // Основные разделы сайта для sitelinks
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'SiteNavigationElement',
          position: 1,
          name: 'Blog Archive',
          description: 'Complete collection of articles about digital business and creator economy',
          url: `${siteUrl}/archiveblog`
        },
        {
          '@type': 'SiteNavigationElement',
          position: 2,
          name: 'Gallery',
          description: 'Visual portfolio and creative projects',
          url: `${siteUrl}/archivegallery`
        },
        {
          '@type': 'SiteNavigationElement',
          position: 3,
          name: 'About',
          description: 'Learn more about Yurie and the blog',
          url: `${siteUrl}/about`
        },
        {
          '@type': 'SiteNavigationElement',
          position: 4,
          name: 'Contact',
          description: 'Get in touch',
          url: `${siteUrl}/contact`
        }
      ]
    }
  }

  // Organization Schema
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

  // Person Schema
  const personSchema = {
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
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Все Schema.org структуры */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
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
      </body>
    </html>
  )
}