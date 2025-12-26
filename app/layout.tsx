import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { ProvidersWrapper } from '@/components/providers-wrapper';
import CookieBanner from '@/components/cookie-banner-client';
import criticalCss from './critical.css.ts'; // ← новый импорт

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Yurie Jiyūbō - Character Blog',
    template: '%s | Yurie Jiyūbō',
  },
  description: 'Personal blog of Yurie Jiyūbō — anime characters, digital dreams, and cozy creativity.',
  metadataBase: new URL('https://yurieblog.vercel.app'),
  openGraph: {
    title: 'Yurie Jiyūbō - Character Blog',
    description: 'Personal blog of Yurie Jiyūbō — anime characters, digital dreams, and cozy creativity.',
    images: ['/images/Yurie_main.jpg'],
    type: 'website',
    url: 'https://yurieblog.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/Yurie_main.jpg'],
  },
  other: {
    copyright: '© 2025 Yurie Jiyūbō',
  },
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* критический CSS инлайн */}
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      </head>
      <body className={poppins.className}>
        <ProvidersWrapper>{children}</ProvidersWrapper>
        <Analytics />
        <GoogleAnalytics gaId="G-SV2M5CRN5M" strategy="lazyOnload" />
        <CookieBanner />
      </body>
    </html>
  );
}