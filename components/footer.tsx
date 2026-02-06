import Link from 'next/link'
import SupportButtonClient from '@/components/support-button-client'
import { BRAND } from '@/lib/brand-voice'

interface FooterProps {
  readonly language: string
}

const content = {
  en: {
    copyright: '© 2025, Character Blog.',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
    about: 'About',
    support: 'Support',
    explore: 'Explore',
    home: 'Home',
    blog: 'Blog',
    gallery: 'Gallery',
    topics: 'Topics',
    connect: 'Connect',
    legal: 'Legal',
    sitemap: 'Sitemap',
  },
  es: {
    copyright: '© 2025, Blog de Personaje.',
    privacy: 'Privacidad',
    terms: 'Términos',
    contact: 'Contacto',
    about: 'Acerca de',
    support: 'Apoyar',
    explore: 'Explorar',
    home: 'Inicio',
    blog: 'Blog',
    gallery: 'Galería',
    topics: 'Temas',
    connect: 'Conectar',
    legal: 'Legal',
    sitemap: 'Mapa del Sitio',
  }
}

export default function Footer({ language }: FooterProps) {
  const t = content[language as keyof typeof content] || content.en

  return (
    <footer className="bg-card border-t border-border/50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-8">
          <SupportButtonClient text={t.support} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <nav aria-label="Main navigation">
            <h3 className="font-semibold text-base mb-4 text-foreground">{t.explore}</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-foreground/70 hover:text-primary transition-colors block">{t.home}</Link></li>
              <li><Link href="/blog" className="text-sm text-foreground/70 hover:text-primary transition-colors block">{t.blog}</Link></li>
              <li><Link href="/gallery" className="text-sm text-foreground/70 hover:text-primary transition-colors block">{t.gallery}</Link></li>
              <li><Link href="/about" className="text-sm text-foreground/70 hover:text-primary transition-colors block">{t.about}</Link></li>
            </ul>
          </nav>

          <nav aria-label="Contact and Social">
            <h3 className="font-semibold text-base mb-4 text-foreground">{t.connect}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-foreground/70 hover:text-primary transition-colors block">
                  {t.contact}
                </Link>
              </li>
              <li>
                <a href="https://bsky.app/profile/yurieblog.bsky.social" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/70 hover:text-[#0085ff] transition-colors flex items-center gap-1">
                  <span className="text-base">🦋</span> Bluesky
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Legal information">
            <h3 className="font-semibold text-base mb-4 text-foreground">{t.legal}</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-foreground/70 hover:text-primary transition-colors block">{t.privacy}</Link></li>
              <li><Link href="/terms" className="text-sm text-foreground/70 hover:text-primary transition-colors block">{t.terms}</Link></li>
              <li><Link href="/pages-list" className="text-sm text-foreground/70 hover:text-primary transition-colors block">
    {t.sitemap}
  </Link>
</li></ul>
          </nav>

          {/* Topics - убраны <li> без ссылок, заменены на span */}
          <div>
            <h3 className="font-semibold text-base mb-4 text-foreground">{t.topics}</h3>
            <div className="space-y-2 text-sm text-foreground/60">
              <p>Digital Business</p>
              <p>Creator Economy</p>
              <p>Online Monetization</p>
              <p>Content Strategy</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 text-center">
          {/* Сюда подставится: "Digital experiments documented. Failures included. Gurus excluded." */}
          <p className="text-sm text-foreground/80 mb-2 italic">
            {BRAND.footer.tagline}
          </p>

          {/* Сюда подставится: "© 2025 Yurie Blog. Made with caffeine, curiosity & questionable decisions 💖" */}
          <p className="text-sm text-foreground/60">
            {BRAND.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}