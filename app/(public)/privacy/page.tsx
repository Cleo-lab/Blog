import type { Metadata } from 'next'

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: 'Privacy Policy | Yurie Jiyūbō',
  description: 'Privacy Policy for Yurie Blog. GDPR & CCPA compliance, data collection, and advertising practices.',
  alternates: { canonical: `${siteUrl}/privacy` },
  robots: {
    index: true,
    follow: true,
  }
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-blue dark:prose-invert max-w-none text-foreground/90">
        <p className="text-sm text-muted-foreground font-medium">Last Updated: January 29, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to <strong>Yurie Blog</strong> ("we", "our", or "us"), operated by <strong>Yurie Jiyūbō</strong>.
            We are committed to protecting your personal information and your right to privacy. 
            This Privacy Policy applies to our website (https://yurieblog.vercel.app) and explains how we collect, use, and safeguard your data.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <ul>
            <li>
              <strong>Personal Information:</strong> Name and Email address (only when explicitly provided by you, e.g., for newsletters).
            </li>
            <li>
              <strong>Usage Data:</strong> IP address, browser type, device info, pages visited, and timestamps (collected automatically).
            </li>
            <li>
              <strong>Cookies:</strong> Small data files stored on your device to improve site functionality, analyze traffic, and support advertising services.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Data</h2>
          <p>We use the collected data for the following purposes:</p>
          <ul>
            <li>To provide and maintain our Service.</li>
            <li>To monitor the usage of our Service (Analytics).</li>
            <li>To detect, prevent, and address technical issues.</li>
            {/* ВНЕСЕННАЯ ПРАВКА НИЖЕ */}
            <li>To serve advertisements, including personalized and non-personalized ads (via Google AdSense).</li>
          </ul>
        </section>

        <section>
          <h2>4. Advertising & Third Parties</h2>
          <p>
            We may use third-party service providers to support our blog. These parties have their own privacy policies.
          </p>
          <div className="pl-4 border-l-4 border-gray-200 dark:border-gray-700 my-4">
            <h3 className="text-lg font-semibold m-0">Google AdSense</h3>
            <p className="mt-2">
              Uses cookies and similar technologies to serve advertisements, including personalized and non-personalized ads, 
              based on your visits to this and other websites. You can opt out of personalized advertising in{' '}
              <a href="https://adssettings.google.com" target="_blank" rel="nofollow noopener noreferrer">
                Google Ad Settings
              </a>.
            </p>
          </div>
          <ul>
            <li>
              <strong>Google Analytics:</strong> Used to analyze website traffic. IP anonymization is enabled where applicable.
            </li>
            <li>
              <strong>Supabase / Resend:</strong> Used for secure data storage and newsletter delivery.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. GDPR Compliance (EEA Users)</h2>
          <p>
            If you are a resident of the European Economic Area (EEA), you have the following data protection rights:
          </p>
          <ul>
            <li>The right to access, update, or delete the information we have on you.</li>
            <li>The right of rectification (to correct errors).</li>
            <li>The right to object to processing.</li>
            <li>The right to data portability.</li>
            <li>The right to withdraw consent at any time.</li>
          </ul>
          <p>
            To exercise these rights, please contact us at{' '}
            <a href="mailto:cleopatrathequeenofcats@gmail.com">cleopatrathequeenofcats@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2>6. CCPA Compliance (California/US Users)</h2>
          <p>
            Under the California Consumer Privacy Act (CCPA), California residents have specific rights regarding their personal data:
          </p>
          <ul>
            <li><strong>Right to Know:</strong> You can request details about the categories of personal data we collect.</li>
            <li><strong>Right to Delete:</strong> You can request the deletion of your personal data.</li>
            <li><strong>Do Not Sell My Info:</strong> We do not sell your personal data for monetary compensation. However, third-party advertising partners (such as Google AdSense) may collect data for ad personalization as defined under CCPA.</li>
          </ul>
        </section>

        <section>
          <h2>7. Children&apos;s Privacy</h2>
          <p>
            Our Service does not address anyone under the age of 13 (or 16 in certain jurisdictions). 
            We do not knowingly collect personally identifiable information from children. 
            If you are a parent and aware that your child has provided us with Personal Data, please contact us.
          </p>
        </section>

        <section>
          <h2>8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact the site operator:</p>
          <div className="not-prose mt-4 bg-muted/30 p-4 rounded-lg border border-border">
            <p className="font-bold text-lg">Yurie Jiyūbō</p>
            <p>
              Email:{' '}
              <a 
                href="mailto:cleopatrathequeenofcats@gmail.com" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                cleopatrathequeenofcats@gmail.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}