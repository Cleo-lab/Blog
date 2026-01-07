import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy and Cookie Policy',
  alternates: { canonical: 'https://yurieblog.vercel.app/privacy' }
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="prose prose-sm dark:prose-invert">
        <p>
          Privacy Policy for YurieBlog. Effective date: 09 December 2025

1. Introduction We operate the website https://yurieblog.vercel.app ("the Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use the Service and the choices you have associated with that data.

2. Information We Collect We collect several different types of information for various purposes to provide and improve our Service to you:

Personal Data: While using our Service (e.g., subscribing to the newsletter or contacting us), we may ask you to provide us with certain personally identifiable information, such as your Email address and Name.

Log files: IP address, browser type, pages visited, time stamp.

Cookies: Small text files stored on your device to track activity and hold certain information.

3. Advertising (Google AdSense)

Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.

Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.

Users may opt out of personalized advertising by visiting Google Ads Settings.

4. Analytics and Third Parties We may use third-party Service Providers to monitor and analyze the use of our Service, store data, or send emails.

Google Analytics: Used for tracking website traffic (IP-anonymization enabled).

Supabase: Used for database and authentication services.

Resend (if applicable): Used for sending newsletters. We do not sell your personal data to third parties.

5. Legal Basis (GDPR) Processing is necessary for our legitimate interest in improving the Service, providing functionality (like newsletters), and maintaining security.

6. Retention Personal data (like emails) is kept as long as you are subscribed or active. Analytics data is automatically deleted after 26 months.

7. Your Rights You may disable cookies in your browser settings. Users in the EU have the right to access, rectify, erase, or port their data. You can unsubscribe from our newsletter at any time by clicking the link in the email or contacting us.

8. Children The Service is not directed to children under 13. We do not knowingly collect personal data from them.

9. Contact For questions regarding this privacy policy, please contact us at: cleopatrathequeenofcats@gmail.com
        </p>
        <p>
          By continuing to browse the site, you agree to our use of cookies.
          You can disable cookies in your browser settings.
        </p>
        <p>
          Contact: <a href="mailto:cleopatrathequeenofcats@gmail.com">cleopatrathequeenofcats@gmail.com</a>
        </p>
      </div>
    </main>
  )
}