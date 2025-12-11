import ArchiveBlogClient from '@/components/archive-blog-client'

export default function ArchiveBlogPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
        Blog Archive
      </h1>
      <ArchiveBlogClient />
    </main>
  )
}