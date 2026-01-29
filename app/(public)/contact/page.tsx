import type { Metadata } from 'next'

const siteUrl = 'https://yurieblog.vercel.app'

export const metadata: Metadata = {
  title: 'Contact Yurie Jiyūbō | Yurie Blog', // Имя в заголовке
  description: 'Get in touch with Yurie Jiyūbō for collaborations, feedback on digital experiments, or inquiries about the creator economy.',
  alternates: { canonical: `${siteUrl}/contact` }
}

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Contact Me</h1>
      
      <div className="prose prose-blue dark:prose-invert">
        <p className="text-lg">
          Have a question about my <strong>digital experiments</strong>, want to discuss the <strong>creator economy</strong>, 
          or just want to say hi? I&apos;m always open to interesting conversations and collaborations.
        </p>

        <div className="mt-8 space-y-6">
          {/* Email Section */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <p>
              For business inquiries or deep-dive questions, drop me a line at:{' '}
              <a href="mailto:cleopatrathequeenofcats@gmail.com" className="text-blue-500 underline">
                cleopatrathequeenofcats@gmail.com
              </a>
            </p>
          </div>

          {/* Socials Section */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Social Media & Profiles</h2>
            <p>You can also find me and my latest updates here:</p>
            <ul className="list-none pl-0">
              <li className="mb-2">
                <strong>Bluesky:</strong>{' '}
                <a href="https://bsky.app/profile/yurieblog.bsky.social" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  @yurieblog.bsky.social
                </a>
              </li>
              <li>
                <strong>GitHub:</strong>{' '}
                <a href="https://github.com/Cleo-lab" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  Cleo-lab
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-sm text-muted-foreground italic">
          Note: I usually respond within 24-48 hours. Looking forward to hearing from you!
        </p>
      </div>
    </main>
  )
}