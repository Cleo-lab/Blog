// app/contact/page.tsx
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/breadcrumbs'
import { BRAND } from '@/lib/brand-voice'

export const metadata: Metadata = {
  // ✅ Используем BRAND
  title: BRAND.titles.contact,
  description: BRAND.descriptions.contact,
  
  alternates: { 
    canonical: `${BRAND.siteUrl}/contact` 
  },
  
  openGraph: {
    title: BRAND.titles.contact,
    description: 'Get in touch for collaboration, questions, or just to chat about digital experiments.',
    url: `${BRAND.siteUrl}/contact`,
    siteName: BRAND.siteName,
    locale: 'en_US',
    type: 'website',
  },
  
  twitter: {
    card: 'summary',
    title: BRAND.titles.contact,
    description: BRAND.descriptions.contact,
    creator: '@yurieblog.bsky.social',
  },
}

export default function ContactPage() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${BRAND.siteUrl}/contact`,
    name: 'Contact Yurie',
    description: BRAND.descriptions.contact,
    url: `${BRAND.siteUrl}/contact`,
    mainEntity: {
      '@type': 'Person',
      '@id': `${BRAND.siteUrl}/#author`,
      name: BRAND.authorName,
      email: 'cleopatrathequeenofcats@gmail.com',
    },
    inLanguage: 'en-US',
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BRAND.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact',
        item: `${BRAND.siteUrl}/contact`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <Breadcrumbs />

        <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          Contact Me
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-foreground/80 leading-relaxed">
            Have a question about my <strong>digital experiments</strong>, want to discuss the <strong>creator economy</strong>, 
            or collaborate on something interesting? I'm always open to conversations with fellow experimenters.
          </p>

          <div className="mt-8 space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-2 text-foreground">Email</h2>
              <p className="text-foreground/80">
                For collaboration inquiries, questions, or just to say hi:
              </p>
              <a 
                href="mailto:cleopatrathequeenofcats@gmail.com" 
                className="inline-flex items-center gap-2 mt-3 text-primary hover:underline font-medium text-lg"
              >
                cleopatrathequeenofcats@gmail.com
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-[#0085ff]/10 border border-[#0085ff]/30">
              <h2 className="text-xl font-semibold mb-2 text-foreground">Social Media</h2>
              <p className="text-foreground/80 mb-4">
                Latest updates, experiments, and behind-the-scenes chaos:
              </p>
              <div className="space-y-3">
                <div>
                  <strong className="text-foreground">Bluesky:</strong>{' '}
                  <a
                    href="https://bsky.app/profile/yurieblog.bsky.social"
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="text-[#0085ff] hover:underline"
                  >
                    @yurieblog.bsky.social
                  </a>
                </div>
                <div>
                  <strong className="text-foreground">GitHub:</strong>{' '}
                  <a
                    href="https://github.com/Cleo-lab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Cleo-lab
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 border-l-4 border-pink-500">
            <p className="text-base text-foreground/70 italic">
              <strong>Response time:</strong> Usually within 24-48 hours. <br />
              <strong>What I'm open to:</strong> Collaborations, questions about experiments, feedback, ideas. <br />
              <strong>What to skip:</strong> Guru courses, get-rich-quick schemes, NFT projects. 😄
            </p>
          </div>
        </div>
      </main>
    </>
  )
}