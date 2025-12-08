export const metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-sm text-foreground/80">
        Email: <a href="mailto:support@yourdomain.com" className="underline">support@yourdomain.com</a>
      </p>
    </main>
  )
}