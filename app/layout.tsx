import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { ProvidersWrapper } from '@/components/providers-wrapper';
import CookieBanner from '@/components/cookie-banner-client';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true, // ✅ Добавили preload
  fallback: ['system-ui', 'arial'], // ✅ Добавили fallback
});

export const metadata: Metadata = {
  title: {
    default: 'Yurie Jiyūbō - Character Blog',
    template: '%s | Yurie Jiyūbō',
  },
  description: 'Personal blog of Yurie Jiyūbō — anime characters, digital dreams, and cozy creativity.',
  keywords: ['anime blog', 'Yurie Jiyūbō', 'character blog', 'digital art', 'anime culture'],
  authors: [{ name: 'Yurie Jiyūbō', url: 'https://yurieblog.vercel.app' }],
  creator: 'Yurie Jiyūbō',
  publisher: 'Yurie Jiyūbō',
  robots: 'index, follow',
  verification: { google: 'WXnuGqV3agaGqnSqBJBEuym8I5KkJuvH4AMNKWXodYM' },
  metadataBase: new URL('https://yurieblog.vercel.app'),
  alternates: { canonical: 'https://yurieblog.vercel.app' },
  openGraph: {
    title: 'Yurie Jiyūbō - Character Blog',
    description: 'Personal blog of Yurie Jiyūbō — anime characters, digital dreams, and cozy creativity.',
    images: ['/images/Yurie_main.jpg'],
    type: 'website',
    url: 'https://yurieblog.vercel.app',
    siteName: "Yurie's Blog",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yurie Jiyūbō - Character Blog',
    description: 'Personal blog of Yurie Jiyūbō — anime characters, digital dreams, and cozy creativity.',
    images: ['/images/Yurie_main.jpg'],
    site: '@yurieblog.bsky.social',
    creator: '@yurieblog.bsky.social',
  },
  other: {
    'hreflang-en': 'https://yurieblog.vercel.app',
    'hreflang-x-default': 'https://yurieblog.vercel.app',
    language: 'English',
    distribution: 'Global',
    copyright: '© 2025 Yurie Jiyūbō',
  },
};

// ✅ JSON-LD вынесен в отдельную функцию
function JsonLdScript() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Yurie Jiyūbō',
    url: 'https://yurieblog.vercel.app',
    description: 'Anime character and blogger sharing digital dreams and cozy creativity.',
    sameAs: ['https://bsky.app/profile/yurieblog.bsky.social'],
    image: 'https://yurieblog.vercel.app/images/Yurie_main.jpg',
    jobTitle: 'Character Blogger',
    alumniOf: 'Digital Dream Academy',
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <JsonLdScript />
        {/* ✅ Preconnect для Google Analytics */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className={poppins.className}>
        <ProvidersWrapper>{children}</ProvidersWrapper>
        <Analytics />
        <GoogleAnalytics gaId="G-SV2M5CRN5M" />
        <CookieBanner />
      </body>
    </html>
  );
}