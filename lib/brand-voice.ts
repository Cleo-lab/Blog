// lib/brand-voice.ts


export const BRAND = {
  // Основные данные
  siteName: 'Yurie Blog',
  authorName: 'Yurie Jiyūbō',
  siteUrl: 'https://yurieblog.vercel.app',
  
  // Тон бренда (для внутреннего использования)
  tone: {
    style: 'humorous, ironic, honest',
    audience: 'curious digital creators, side hustlers, experiment enthusiasts',
    avoid: 'corporate speak, guru promises, motivational BS',
  },
  
  // Короткие описания (для мета-тегов, 50-70 символов)
  taglines: {
    short: 'Digital experiments, honest failures, accidental wins',
    medium: 'Real stories from digital experiments — no filters, no BS',
    long: 'Honest experiments in creator economy, side hustles & digital chaos',
  },
  
  // Полные описания (120-160 символов для meta description)
  descriptions: {
    homepage: 'Digital business experiments gone right (and hilariously wrong). Real data from creator economy trenches, side hustles, and monetization chaos. No gurus here.',
    
    about: 'Personal blog about online experiments that actually happened — from successful digital projects to spectacular failures. Real stories, real data, real laughs. No motivational BS.',
    
    blog: 'Complete collection of digital experiment stories: creator economy insights, side hustle adventures, monetization attempts, and lessons from online business chaos.',
    
    gallery: 'Visual journey through AI experiments, digital art attempts, and creative chaos. Because every experiment deserves documentation — even the questionable ones.',
    
    contact: 'Want to discuss failed experiments, share digital chaos stories, or collaborate on the next side hustle? Drop a message. Serious inquiries welcome, guru pitches not so much.',
  },
  
  // Заголовки (50-60 символов)
  titles: {
    homepage: 'Yurie Blog — Digital Experiments & Creator Economy Chaos',
    about: 'About Yurie — Digital Experiments, Honest Failures & Wins',
    blog: 'Blog — Real Digital Experiments & Side Hustle Stories',
    gallery: 'Gallery — AI Art, Digital Experiments & Creative Chaos',
    contact: 'Contact — Let\'s Talk Digital Experiments & Side Hustles',
  },
  
  // H1 заголовки (для страниц)
  headings: {
    homepage: 'Digital Business Experiments — Real Stories from Creator Economy Trenches',
    about: 'About Yurie — The Person Behind These Digital Experiments',
    blog: 'Blog — Every Experiment, Failed Launch & Accidental Win',
    gallery: 'Gallery — Just Visuals, No Deep Meaning',},
  
  // Intro текста (для hero секций)
  intros: {
    homepage: 'Welcome to the internet`s most honest experiment log. Here you`ll find real stories about digital business attempts, creator economy reality checks, and online monetization adventures — some successful, many hilarious, all true.',
    
    about: 'This is a personal blog about learning how the internet actually works — not how influencers pretend it does. Expect honest stories about online experiments, creator economy adventures, and digital platforms chaos.',
    
    blog: 'Welcome to the full archive of digital experiments, side hustle attempts, and creator economy reality checks. Every failed launch, unexpected growth spike, and accidental discovery — documented with brutal honesty (and occasional humor).',
    
    gallery: `Visual documentation of creative experiments and AI art adventures. Mostly just pictures based on current moods — don't look for deep meaning here. Some worked brilliantly, some are questionable, but that's how experiments work.`,},
  
  // CTA тексты
  ctas: {
    readMore: 'Read the chaos →',
    followBluesky: 'Follow for daily experiment updates 🦋',
    viewArchive: 'Browse all experiments →',
    contact: 'Let\'s collaborate on something →',
    support: 'Support these experiments',
  },
  
  // Footer текст
  footer: {
    copyright: '© 2026 Yurie Blog. Made with caffeine, curiosity & questionable decisions 💖',
    tagline: 'Digital experiments documented. Failures included. Gurus excluded.',
  },
}

// Utility функция для получения описания нужной длины
export function getDescription(page: keyof typeof BRAND.descriptions, maxLength: number = 160): string {
  const desc = BRAND.descriptions[page]
  return desc.length > maxLength ? desc.slice(0, maxLength - 3) + '...' : desc
}

// Utility функция для Schema.org описания
export function getSchemaDescription(page: keyof typeof BRAND.descriptions): string {
  // Более формальная версия для Schema.org
  const formalDescriptions = {
    homepage: 'Personal blog documenting digital business experiments, creator economy insights, and online monetization strategies with honest, data-driven storytelling.',
    about: 'Learn about the author behind digital experiment stories, creator economy insights, and honest online business documentation.',
    blog: 'Archive of digital business experiments, creator economy case studies, and real stories from online entrepreneurship adventures.',
    gallery: 'Collection of AI-generated art, digital creative experiments, and visual documentation of online creative projects.',
    contact: 'Contact page for collaboration inquiries, digital experiment discussions, and business partnership opportunities.',
  }
  return formalDescriptions[page]
}