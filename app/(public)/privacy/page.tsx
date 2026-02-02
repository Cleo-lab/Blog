import type { Metadata } from 'next'
import Link from 'next/link'

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: 'Privacy Policy | Yurie Jiyūbō',
  description: 'Privacy Policy for Yurie Blog. Information regarding data collection, cookies, and third-party services.',
  alternates: { canonical: `${siteUrl}/privacy` },
  robots: {
    index: true,
    follow: true,
  }
}

export default function PrivacyPage() {
  // Навигация для удобства (Google это любит)
  const sections = [
    { id: 'intro', title: '1. Introduction' },
    { id: 'collection', title: '2. Data Collection' },
    { id: 'usage', title: '3. How We Use Data' },
    { id: 'ads', title: '4. Advertising & Cookies' },
    { id: 'rights', title: '5. Your Rights (GDPR/CCPA)' },
    { id: 'contact', title: '6. Contact' },
  ]

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Боковая колонка (Навигация) - скрыта на мобильных */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 h-fit">
          <div className="border-l-2 border-border/50 pl-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Table of Contents
            </p>
            {sections.map(s => (
              <a 
                key={s.id} 
                href={`#${s.id}`} 
                className="block text-sm text-foreground/70 hover:text-pink-500 transition-colors"
              >
                {s.title}
              </a>
            ))}
          </div>
        </aside>

        {/* Основной контент */}
        <div className="lg:col-span-9">
          <header className="mb-10 pb-6 border-b border-border">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">
              Last Updated: <time dateTime="2026-02-02">February 2, 2026</time>
            </p>
          </header>

          <div className="prose prose-pink dark:prose-invert max-w-none">
            
            <section id="intro" className="scroll-mt-28">
              <h2>1. Introduction</h2>
              <p>
                Welcome to <strong>Yurie Blog</strong> ("we", "our", or "us"). This is a personal blog operated by the content creator known as <strong>Yurie Jiyūbō</strong> (a pseudonym).
              </p>
              <p>
                We respect your privacy and are committed to protecting it. This Privacy Policy explains our practices regarding the information we collect from you when you visit our website (https://yurieblog.vercel.app).
              </p>
              <p className="bg-muted/30 p-4 rounded-lg text-sm border border-border/50">
                <strong>Note for Visitors:</strong> This is a personal hobby site. We do not sell physical products, and we minimize data collection to what is necessary for site functionality, analytics, and security.
              </p>
            </section>

            <section id="collection" className="scroll-mt-28">
              <h2>2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul>
                <li>
                  <strong>Voluntary Information:</strong> Information you explicitly provide (e.g., if you contact us via email or sign up for a newsletter), such as your name or email address.
                </li>
                <li>
                  <strong>Automatic Data (Log Files):</strong> Like most websites, we automatically collect certain data when you visit, including IP address, browser type, referring/exit pages, and operating system. This is used for security and site optimization.
                </li>
                <li>
                  <strong>Cookies:</strong> We use cookies to store visitor preferences and record session information. You can control cookies through your browser settings.
                </li>
              </ul>
            </section>

            <section id="usage" className="scroll-mt-28">
              <h2>3. How We Use Your Data</h2>
              <p>We use the collected information solely for:</p>
              <ul>
                <li>Operating and maintaining the blog.</li>
                <li>Improving user experience and analyzing site traffic (via Google Analytics).</li>
                <li>Sending you updates (only if you have opted in).</li>
                <li>Protecting against unauthorized or illegal activity.</li>
              </ul>
            </section>

            <section id="ads" className="scroll-mt-28">
              <h2>4. Advertising & Third-Party Services</h2>
              <p>
                While this is a personal blog, we may use third-party services to support our infrastructure and potential future monetization.
              </p>
              
              <h3>Google AdSense & DoubleClick Cookie</h3>
              <p>
                We may use Google AdSense to display advertisements. Google, as a third-party vendor, uses cookies (specifically the DoubleClick DART cookie) to serve ads based on your visit to this site and other sites on the Internet.
              </p>
              <div className="not-prose bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl text-sm mb-6">
                <strong>Your Control:</strong> You may opt out of the use of the DART cookie for interest-based advertising by visiting the{' '}
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium underline">
                  Google Ad Settings
                </a>.
              </div>

              <h3>Analytics</h3>
              <p>
                We use <strong>Google Analytics</strong> to understand how visitors engage with the site. Google Analytics collects information anonymously. It reports website trends without identifying individual visitors.
              </p>
            </section>

            <section id="rights" className="scroll-mt-28">
              <h2>5. Your Rights (GDPR & CCPA)</h2>
              <p>
                Depending on your location, you may have specific rights regarding your data:
              </p>
              
              <h3>For EEA/UK Users (GDPR)</h3>
              <p>
                Since we do not maintain a physical business office for this blog, we operate on a minimization principle. You have the right to access, rectify, or erase any personal data we might hold (e.g., if you emailed us).
              </p>

              <h3>For California Users (CCPA)</h3>
              <p>
                We do not sell your personal information. However, allowing third-party ad networks (like Google) to collect data via cookies may be considered a "sale" under California law. You have the right to opt-out of this by adjusting your browser's cookie settings or using Google's tools mentioned above.
              </p>
            </section>

            <section id="contact" className="scroll-mt-28">
              <h2>6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us via email. As this is a personal project operated under a pseudonym, email is our primary and official channel of communication.
              </p>
              <div className="not-prose mt-6 flex items-center gap-4 p-4 rounded-lg bg-card border border-border">
                <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 font-bold">
                  @
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Contact Email</p>
                  <a href="mailto:cleopatrathequeenofcats@gmail.com" className="text-foreground hover:text-pink-500 transition-colors font-medium">
                    cleopatrathequeenofcats@gmail.com
                  </a>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  )
}