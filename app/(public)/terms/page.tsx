import type { Metadata } from 'next'

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: 'Terms of Service | Yurie Jiyūbō',
  description: 'Terms and conditions for using Yurie Blog. Guidelines for content, copyright, and user conduct.',
  alternates: { canonical: `${siteUrl}/terms` },
  robots: {
    index: true,
    follow: true,
  }
}

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-blue dark:prose-invert max-w-none">
        <p className="text-sm text-muted-foreground">Last updated: December 2025</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using <strong>Yurie Blog</strong> (https://yurieblog.vercel.app), 
            operated by <strong>Yurie Jiyūbō</strong>, you agree to be bound by these Terms of Service 
            and all applicable laws and regulations.
          </p>
        </section>

        <section>
          <h2>2. Intellectual Property Rights</h2>
          <p>
            All content on this website, including text, graphics, logos, and code experiments, 
            is the intellectual property of <strong>Yurie Jiyūbō</strong> unless otherwise stated. 
            You may not reproduce, distribute, or sell any content without express written permission.
          </p>
        </section>

        <section>
          <h2>3. Disclaimer and Limitation of Liability</h2>
          <p>
            The information provided on Yurie Blog is for <strong>educational and informational purposes only</strong>. 
            Digital business experiments, AI tools, and online strategies involve risks. 
            Yurie Jiyūbō is not responsible for any financial losses or technical issues 
            arising from the use of information found on this site.
          </p>
        </section>

        <section>
          <h2>4. Age Restrictions</h2>
          <p>
            Given the nature of some content (digital experiments and side hustles), 
            you must be at least <strong>18 years of age</strong> to use this Service. 
            By using the site, you warrant that you meet this age requirement.
          </p>
        </section>

        <section>
          <h2>5. External Links</h2>
          <p>
            Our blog may contain links to third-party websites. We have no control over, 
            and assume no responsibility for, the content or privacy policies of any 
            third-party sites or services.
          </p>
        </section>

        <section>
          <h2>6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use 
            of the site following any changes constitutes your acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>
            For any questions regarding these Terms, please contact <strong>Yurie Jiyūbō</strong> at:{' '}
            <a href="mailto:cleopatrathequeenofcats@gmail.com">cleopatrathequeenofcats@gmail.com</a>
          </p>
        </section>
      </div>
    </main>
  )
}