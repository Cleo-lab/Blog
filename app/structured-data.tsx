export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Yurie Jiyūbō",
    url: "https://yurieblog.vercel.app",
    description: "Anime character and blogger sharing digital dreams and cozy creativity.",
    image: "https://yurieblog.vercel.app/Yurie_main.jpg",
    sameAs: ["https://bsky.app/profile/yurieblog.bsky.social"],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}