import ArchiveGalleryClient from '@/components/archive-gallery-client'

export default function ArchiveGalleryPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
        Gallery Archive
      </h1>
      <ArchiveGalleryClient />
    </main>
  )
}