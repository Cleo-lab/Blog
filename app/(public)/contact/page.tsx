import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  alternates: { canonical: 'https://yurieblog.vercel.app/contact' }
}

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-sm text-foreground/80">
        Email: <a href="mailto:cleopatrathequeenofcats@gmail.com" className="underline">cleopatrathequeenofcats@gmail.com</a>
      </p>
    </main>
  )
}
