import type { Metadata } from 'next'
import Link from 'next/link'

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: 'Terms of Service | Yurie Jiyūbō',
  description: 'Terms and conditions for using Yurie Blog. User conduct, intellectual property rights, and liability disclaimers.',
  alternates: { canonical: `${siteUrl}/terms` },
  robots: {
    index: true,
    follow: true,
  }
}

export default function TermsPage() {
  const sections = [
    { id: 'agreement', title: '1. Agreement to Terms' },
    { id: 'ip', title: '2. Intellectual Property' },
    { id: 'conduct', title: '3. User Conduct' },
    { id: 'disclaimer', title: '4. Disclaimers' },
    { id: 'liability', title: '5. Limitation of Liability' },
    { id: 'changes', title: '6. Changes to Terms' },
  ]

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Боковая навигация */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 h-fit">
          <div className="border-l-2 border-border/50 pl-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Terms of Service
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
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">
              Last Updated: <time dateTime="2026-02-02">February 2, 2026</time>
            </p>
          </header>

          <div className="prose prose-pink dark:prose-invert max-w-none">
            
            <section id="agreement" className="scroll-mt-28">
              <h2>1. Agreement to Terms</h2>
              <p>
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and <strong>Yurie Jiyūbō</strong> ("we," "us" or "our"), concerning your access to and use of the <strong>Yurie Blog</strong> website (https://yurieblog.vercel.app).
              </p>
              <p>
                By accessing the Site, you confirm that you have read, understood, and agreed to be bound by all of these Terms of Service. If you do not agree with all of these terms, then you are expressly prohibited from using the Site and must discontinue use immediately.
              </p>
            </section>

            <section id="ip" className="scroll-mt-28">
              <h2>2. Intellectual Property Rights</h2>
              <p>
                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") are owned or controlled by us and are protected by copyright and trademark laws.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Personal Use:</strong> You are granted a limited license to access and use the Site for your personal, non-commercial use.</li>
                <li><strong>Code Snippets:</strong> Code examples provided in blog posts are open for educational use, but full reproduction of the site's codebase is prohibited.</li>
              </ul>
            </section>

            <section id="conduct" className="scroll-mt-28">
              <h2>3. User Representations & Conduct</h2>
              <p>
                By using the Site, specifically the commenting and profile features, you agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Make any unauthorized use of the Site, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email.</li>
                <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Site to you.</li>
                <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material that interferes with any party’s uninterrupted use and enjoyment of the Site.</li>
              </ul>
              <p className="bg-red-500/10 p-4 rounded-lg border border-red-500/20 text-sm mt-4">
                <strong>Termination:</strong> We reserve the right to suspend or terminate your account and access to the Site at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users.
              </p>
            </section>

            <section id="disclaimer" className="scroll-mt-28">
              <h2>4. Educational Disclaimer</h2>
              <div className="bg-yellow-500/10 p-6 rounded-xl border border-yellow-500/20">
                <p className="font-bold mb-2 text-yellow-600 dark:text-yellow-400">Not Financial Advice</p>
                <p className="m-0 text-sm">
                  The information provided on this blog regarding digital business experiments, monetization strategies, and creator economy insights is for <strong>educational and informational purposes only</strong>. It does not constitute financial, legal, or professional business advice. 
                </p>
                <p className="mt-2 m-0 text-sm">
                  Yurie Jiyūbō is not responsible for any financial losses or outcomes resulting from your use of the information provided. Your business results may vary based on your personal capacity, experience, and market conditions.
                </p>
              </div>
            </section>

            <section id="liability" className="scroll-mt-28">
              <h2>5. Limitation of Liability</h2>
              <p>
                In no event will we be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
              </p>
              <p>
                The Site is provided on an "AS-IS" and "AS-AVAILABLE" basis. You agree that your use of the Site and our services will be at your sole risk.
              </p>
            </section>

            <section id="changes" className="scroll-mt-28">
  <h2>6. Changes to Terms</h2>
  <p>
    We reserve the right to modify these Terms at any time. All changes will be effective 
    immediately upon posting to the Site. 
  </p>
  {/* Добавляем юридическую строгость здесь */}
  <p className="font-medium">
    It is your responsibility to review these Terms periodically to stay informed of updates. 
    Your continued use of the Site following any changes constitutes your acceptance of the new terms.
  </p>
</section>
            
          </div>
        </div>
      </div>
    </main>
  )
}