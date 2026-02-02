import type { Metadata } from 'next'
import { Mail, Github, MessageSquare, Clock } from 'lucide-react'

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: 'Contact Yurie Jiyūbō | Yurie Blog',
  description: 'Contact Yurie Jiyūbō for collaborations, digital business experiments, or creator economy insights.',
  alternates: { canonical: `${siteUrl}/contact` }
}

export default function ContactPage() {
  // Данные для Google, чтобы он связал эту страницу с твоим профилем
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'mainEntity': {
      '@type': 'Person',
      'name': 'Yurie Jiyūbō',
      'url': siteUrl,
      'jobTitle': 'Digital Entrepreneur',
      'contactPoint': {
        '@type': 'ContactPoint',
        'email': 'cleopatrathequeenofcats@gmail.com',
        'contactType': 'customer support'
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Let&apos;s Connect
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question about my digital experiments or want to collaborate? 
            I&apos;m always open to discussing the creator economy and data-driven strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Email Card */}
          <div className="p-8 rounded-3xl bg-card border border-border/50 hover:border-pink-500/50 transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6">
              <Mail className="w-6 h-6 text-pink-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Email Me</h2>
            <p className="text-muted-foreground mb-4 text-sm">Best for business inquiries and long-form thoughts.</p>
            <a 
              href="mailto:cleopatrathequeenofcats@gmail.com" 
              className="text-lg font-medium text-foreground hover:text-pink-500 transition-colors break-all underline decoration-pink-500/30"
            >
              cleopatrathequeenofcats@gmail.com
            </a>
          </div>

          {/* Social Card */}
          <div className="p-8 rounded-3xl bg-card border border-border/50 hover:border-blue-500/50 transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
              <MessageSquare className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Social Media</h2>
            <p className="text-muted-foreground mb-4 text-sm">Follow me for real-time experiment updates.</p>
            <div className="space-y-3">
              <a href="https://bsky.app/profile/yurieblog.bsky.social" target="_blank" className="flex items-center gap-2 text-foreground hover:text-blue-500 transition-colors">
                <span className="text-lg">🦋 Bluesky</span>
              </a>
              <a href="https://github.com/Cleo-lab" target="_blank" className="flex items-center gap-2 text-foreground hover:text-blue-500 transition-colors">
                <Github className="w-5 h-5" /> <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Дополнительная информация для доверия */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-8 rounded-3xl bg-muted/30 border border-border/20">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-pink-500" />
            <span>Response time: 24-48 hours</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-border" />
          <div className="text-sm text-muted-foreground">
            Based in <span className="text-foreground font-medium text-pink-500/80">Digital Space</span>
          </div>
        </div>
      </main>
    </>
  )
}