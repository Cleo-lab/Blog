
import { MetadataRoute } from 'next'

export const revalidate = 86400
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const privatePaths = [
    '/api/',
    '/admin/',
    '/auth/',
    '/drafts/',
    '/preview/',
    '/checkout/',
  ]

  return {
    rules: [
      
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
          'Google-Extended',
          'Applebot-Extended',
          'OAI-SearchBot',
          'PerplexityBot',
          'Bytespider',
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'BLEXBot',
          'DotBot',
          'Exabot',
        ],
        disallow: '/',
      },
      
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/_next/static/',
          '/_next/image',
          '/videos/',
          '/storage/v1/object/public/',
        ],
        disallow: privatePaths,
      },
      
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/_next/static/',
          '/_next/image',
          '/videos/',
          '/storage/v1/object/public/',
        ],
        disallow: privatePaths,
      },
      
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },
    ],
    sitemap: 'https://yurieblog.vercel.app/sitemap.xml'
  }
}
