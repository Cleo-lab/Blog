import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import dynamic from 'next/dynamic';          // ← для отложенной загрузки
import './globals.css';
import { ProvidersWrapper } from '@/components/providers-wrapper';
import CookieBanner from '@/components/cookie-banner-client';
/* 1. Ленивый CookieBanner – не рендерим на сервере и не блокируем paint */


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'Yurie Jiyūbō - Character Blog',
    template: '%s | Yurie Jiyūbō'
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
    images: ['/Yurie_main.jpg'],
    type: 'website',
    url: 'https://yurieblog.vercel.app',
    siteName: "Yurie's Blog"
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yurie Jiyūbō - Character Blog',
    description: 'Personal blog of Yurie Jiyūbō — anime characters, digital dreams, and cozy creativity.',
    images: ['/Yurie_main.jpg'],
    site: '@yurieblog.bsky.social',
    creator: '@yurieblog.bsky.social'
  },
  other: {
    'hreflang-en': 'https://yurieblog.vercel.app',
    'hreflang-x-default': 'https://yurieblog.vercel.app',
    language: 'English',
    distribution: 'Global',
    copyright: '© 2025 Yurie Jiyūbō'
  }
};


export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{/* ваш head */}</head>
      <body className={poppins.className}>
        <ProvidersWrapper>{children}</ProvidersWrapper>
        <Analytics />
        <GoogleAnalytics gaId="G-SV2M5CRN5M" strategy="worker" />
        <CookieBanner /> {/* теперь клиентский и lazy */}
      </body>
    </html>
  );
}