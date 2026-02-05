// components/hero-server.tsx — CRITICAL FIX
import Image from 'next/image'
import HeroButtons from './hero-buttons'
import { BRAND } from '@/lib/brand-voice'

export default function HeroServer() {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[calc(100svh-4rem)] pt-12 pb-8 flex flex-col items-center justify-center overflow-hidden">
      {/* Decorative elements — pure CSS, no hydration issues */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="text-center z-10 px-4">
        <div className="hero-avatar-gradient w-60 h-60 rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-1 mb-6 mx-auto">
          <Image
            src="/images/Yurie_main.jpg"
            alt={`${BRAND.authorName} - ${BRAND.siteName}`} 
            width={240}
            height={240}
            priority
            fetchPriority="high"
            quality={75}
            sizes="(max-width: 768px) 240px, 240px"
            className="hero-avatar w-full h-full rounded-full object-cover"
          />
        </div>

        {/* ✅ CRITICAL: H1 must be REAL text, not image, not delayed */}
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          {BRAND.siteName}
        </h1>

        {/* ✅ Subtitle as p, not competing H1 */}
        <p className="text-sm sm:text-base font-medium tracking-[0.2em] uppercase text-muted-foreground/80 mb-3">
          {BRAND.authorName}
        </p>

        <div className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
          <p>{BRAND.taglines.medium}</p>
          <span className="block mt-2 text-lg sm:text-xl font-medium text-foreground/80">
            Real stories from the trenches. 💸
          </span>
        </div>

        <p className="text-base sm:text-lg text-muted-foreground/80 mb-8 max-w-xl mx-auto italic leading-relaxed">
          {BRAND.intros.homepage}
        </p>

        <HeroButtons />
      </div>

      {/* Schema remains identical for all users/bots */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": BRAND.siteUrl,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${BRAND.siteUrl}/archiveblog?search={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "ImageObject",
              "contentUrl": `${BRAND.siteUrl}/images/Yurie_main.jpg`,
              "description": BRAND.headings.homepage,
              "name": `${BRAND.siteName} Hero Image`,
              "author": {
                "@type": "Person",
                "name": BRAND.authorName
              }
            }
          ])
        }}
      />
    </section>
  )
}