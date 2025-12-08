import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://yurieblog.vercel.app', lastModified: new Date() },
    { url: 'https://yurieblog.vercel.app/blog', lastModified: new Date() },
    { url: 'https://yurieblog.vercel.app/privacy', lastModified: new Date() },
  ]
}