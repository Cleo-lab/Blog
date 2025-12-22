import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react' // Импортируем аналитику
import './globals.css'
import { ProvidersWrapper } from '@/components/providers-wrapper'
import CookieBanner from '@/components/cookie-banner'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Yurie Jiyūbō - Character Blog',
  description: "Welcome to Yurie Jiyūbō's personal blog - a dreamy digital world",
  verification: { google: 'WXnuGqV3agaGqnSqBJBEuym8I5KkJuvH4AMNKWXodYM' },
  metadataBase: new URL('https://yurieblog.vercel.app'),
  openGraph: {
    title: 'Yurie Jiyūbō - Character Blog',
    description: "Welcome to Yurie Jiyūbō's personal blog - a dreamy digital world",
    images: ['/Yurie_main.jpg'],
    type: 'website',
  },
  // Добавь этот блок для Bluesky и Twitter:
  twitter: {
    card: 'summary_large_image', // Это заставит картинку быть большой
    title: 'Yurie Jiyūbō - Character Blog',
    description: "Welcome to Yurie Jiyūbō's personal blog",
    images: ['/Yurie_main.jpg'],
  },
}

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ProvidersWrapper>
          {children}
        </ProvidersWrapper>

        {/* Vercel Analytics автоматически отслеживает посещения */}
        <Analytics />

        <CookieBanner />
      </body>
    </html>
  )
}