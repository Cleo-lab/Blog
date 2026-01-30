import Image from 'next/image'
import HeroButtons from './hero-buttons'

const siteUrl = 'https://yurieblog.vercel.app'

export default function HeroServer() {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[calc(100svh-4rem)] pt-12 pb-8 flex flex-col items-center justify-center overflow-hidden">
      {/* Декоративные круги */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="text-center z-10 px-4">
        <div className="hero-avatar-gradient w-60 h-60 rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-1 mb-6 mx-auto">
          <Image
            src="/images/Yurie_main.jpg"
            alt="Yurie Jiyūbō - Digital Business Experiments & Creator Economy" 
            width={240}
            height={240}
            priority
            fetchPriority="high"
            quality={75}
            sizes="(max-width: 768px) 240px, 240px"
            className="hero-avatar w-full h-full rounded-full object-cover"
          />
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Yurie Blog - Digital Business Experiments & Creator Economy Insights
        </h1>

        <div className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
          <p>Creator Economy Insights, Data & Digital Reality.</p>
          <span className="block mt-2 text-lg sm:text-xl font-medium">
            Real entrepreneurial stories from the trenches. 💸
          </span>
        </div>

        <p className="text-base sm:text-lg text-muted-foreground/80 mb-8 max-w-xl mx-auto italic">
          Honest insights about digital entrepreneurship, monetization strategies, and creator economy analytics. Data-driven storytelling.
        </p>

        <HeroButtons />
      </div>

      {/* SEO Schema для Hero секции */}
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": siteUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "contentUrl": `${siteUrl}/images/Yurie_main.jpg`,
        "description": "Yurie Jiyūbō - Digital Business Experiments & Creator Economy",
        "name": "Yurie Blog Hero Image",
        "author": {
          "@id": `${siteUrl}/#author`
        }
      }
    ])
  }}
/>
    </section>
  )
}