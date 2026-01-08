import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Yurie — Experiments, Side Hustles & The Internet',
  description:
    'Personal blog about online experiments, creator economy, adult platforms, AI tools, and web development. Real data, real mistakes, no gurus.',
  alternates: {
    canonical: 'https://yurieblog.vercel.app/about',
  },
  openGraph: {
    title: 'About Yurie — Experiments, Side Hustles & The Internet',
    description: 'Real data, real mistakes, no gurus. Get to know the author behind the experiments.',
    url: 'https://yurieblog.vercel.app/about',
    siteName: "Yurie's Blog",
    images: [
      {
        url: '/images/About.webp',
        width: 1200,
        height: 630,
        alt: 'About Yurie',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Yurie — Experiments, Side Hustles & The Internet',
    description: 'Real data, real mistakes, no gurus.',
    images: ['/images/About.webp'],
    creator: '@yurieblog.bsky.social',
  },
}

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Image
        src="/images/About.webp"
        alt="Yurie — personal blog author and digital creator"
        width={768}
        height={320}
        priority
        className="w-full h-auto object-contain rounded-2xl mb-6 shadow-lg"
      />
      
      <h1 className="text-3xl font-bold mb-4">
        About Yurie — Personal Blog & Internet Experiments
      </h1>

      <div className="space-y-4 text-foreground/90">
        <p>
          Hi! I’m Yurie! This is{' '}
          <Link href="/" className="underline text-purple-600 hover:text-pink-500 transition-colors font-medium">
            my personal blog
          </Link>{' '}
          about online experiments, side hustles, and learning how the internet actually works - not how influencers pretend it does.
        </p>

        <p>
          Here I write about building projects from scratch, the creator economy, adult platforms, AI tools, web development, and what happens when curiosity meets algorithms. Some stories are funny, some are uncomfortable, and some accidentally turn into technical deep dives.
        </p>

        <p>
          This blog is not about overnight success, passive income, or motivational quotes. It’s about real experiences: failed ideas, unexpected growth, account bans, analytics spikes, bad UX decisions, and figuring things out by trial and error.
        </p>

        <p>
          If you’re interested in personal blogging, digital platforms, content creation, AI experiments, web development, and honest storytelling about the modern internet — you’re in the right place.
        </p>
      </div>

      <div className="mt-6 p-4 bg-muted/30 rounded-xl border-l-4 border-primary">
        <p className="italic">
          No gurus. No courses. No fake success stories.<br />
          Just experiments, data, mistakes, and lessons learned in public.
        </p>
      </div>

      {/* Bluesky Connect Section */}
      <div className="mt-12 p-6 rounded-2xl bg-[#0085ff]/10 border border-[#0085ff]/30 shadow-sm">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-foreground">
          Let's connect! <span className="text-2xl">🦋</span>
        </h2>
        <p className="text-lg text-foreground/80 mb-6">
          I share real-time updates on my experiments and deep dives into the creator economy on Bluesky.
        </p>
        <a
          href="https://bsky.app/profile/yurieblog.bsky.social"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#0085ff] text-white rounded-xl hover:bg-[#0070d6] transition-all font-bold shadow-lg shadow-blue-500/25 active:scale-95"
          style={{ backgroundColor: '#0085ff', color: 'white' }}
        >
          Follow @yurieblog on Bluesky
        </a>
      </div>

      <p className="mt-8 text-sm text-foreground/60 border-t border-border/50 pt-6">
        Contact for collaborations or questions:{' '}
        <a href="mailto:cleopatrathequeenofcats@gmail.com" className="underline hover:text-primary transition-colors">
          cleopatrathequeenofcats@gmail.com
        </a>
      </p>
    </main>
  )
}