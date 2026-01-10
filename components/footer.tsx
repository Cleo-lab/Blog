'use client'

import Link from 'next/link'

interface FooterProps {
  readonly language: string
}

const content = {
  en: {
    copyright: '© 2025, Character Blog.',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
    about: 'About'
  },
  es: {
    copyright: '© 2025, Blog de Personaje.',
    privacy: 'Privacidad',
    terms: 'Términos',
    contact: 'Contacto',
    about: 'Acerca de'
  }
}

export default function Footer({ language }: FooterProps) {
  const t = content[language as keyof typeof content] || content.en

  return (
    <footer className="bg-card border-t border-border/50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/60">
            {t.copyright} Made with love 💖
          </p>

          <nav className="flex gap-6" aria-label="Footer navigation">
		  <Link href="/sitemap-html">Sitemap</Link>
            <Link
              href="/privacy"
              className="text-xs text-foreground/50 hover:text-foreground transition-colors"
              aria-label={`Learn more about our ${t.privacy} Policy`}
            >
              {t.privacy}
            </Link>

            <Link
              href="/terms"
              className="text-xs text-foreground/50 hover:text-foreground transition-colors"
              aria-label={`${t.terms} of Service`}
            >
              {t.terms}
            </Link>

            <Link
              href="/contact"
              className="text-xs text-foreground/50 hover:text-foreground transition-colors"
              aria-label={t.contact}
            >
              {t.contact}
            </Link>

            <Link
              href="/about"
              className="text-xs text-foreground/50 hover:text-foreground transition-colors"
              aria-label={t.about}
            >
              {t.about}
            </Link>
			<a
  href="https://bsky.app/profile/yurieblog.bsky.social"
  target="_blank"
  rel="noopener noreferrer"
  className="text-xs font-bold text-[#0085ff] hover:brightness-110 transition-all flex items-center gap-1"
>
  <span className="text-[14px]">🦋</span> Bluesky
</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}