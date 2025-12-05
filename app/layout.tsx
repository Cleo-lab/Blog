import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ProvidersWrapper } from '@/components/providers-wrapper'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Yurie Jiyūbō - Character Blog',
  description: "Welcome to Yurie Jiyūbō's personal blog - a dreamy digital world",
}

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ProvidersWrapper>{children}</ProvidersWrapper>

        {/* AdSense script for test ads */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
