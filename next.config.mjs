import withBundleAnalyzer from '@next/bundle-analyzer'

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Добавляем редиректы здесь
  async redirects() {
    return [
      {
        source: '/archiveblog',
        destination: '/blog',
        permanent: true, // 301 редирект: говорит гуглу, что страница переехала навсегда
      },
      {
        source: '/archivegallery',
        destination: '/gallery',
        permanent: true,
      },
    ]
  },

  trailingSlash: false, 
  compress: true,
  poweredByHeader: false,
  
  turbopack: {},
  
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ['lucide-react', 'react-markdown'],
    proxyTimeout: 180000,
  },
  
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 240, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/fonts/:all*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default bundleAnalyzer(nextConfig)