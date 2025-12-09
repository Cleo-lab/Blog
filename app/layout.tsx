import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ProvidersWrapper } from '@/components/providers-wrapper'
import CookieConsent from "react-cookie-consent";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Yurie Jiyūbō - Character Blog',
  description: "Welcome to Yurie Jiyūbō's personal blog - a dreamy digital world",
  verification: {
    google: 'WXnuGqV3agaGqnSqBJBEuym8I5KkJuvH4AMNKWXodYM',
  },
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
		<CookieConsent
  location="bottom"
  buttonText="I understand"
  cookieName="mySiteCookieConsent"
  style={{ background: "#2B373B" }}
  buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
  expires={150}
>
  This website uses cookies to enhance the user experience.{" "}
  <a href="/privacy-policy" style={{ color: "#FFF", textDecoration: "underline" }}>
    Learn more
  </a>
</CookieConsent>
      </body>
    </html>
  )
}
