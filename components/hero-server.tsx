import Image from 'next/image'
import HeroButtons from './hero-buttons'

export default function HeroServer() {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[calc(100svh-4rem)] pt-12 pb-8 flex flex-col items-center justify-center overflow-hidden">
      {/* Декоративные круги */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="text-center z-10 px-4">
        <div className="hero-avatar-gradient w-60 h-60 rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-1 mb-6 mx-auto">
          <Image
            src="/images/Yurie_main.jpg"
            alt="Yurie — personal blogger sharing real stories about internet experiments, side hustles, and digital platforms"
            width={240}
            height={240}
            priority
            fetchPriority="high"
            quality={75}
            sizes="(max-width: 768px) 480px, 480px"
            className="hero-avatar w-full h-full rounded-full object-cover"
          />
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Yurie's Internet Experiments
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
          Side hustles that flopped. AI tools that glitched. 
          <span className="block mt-2">
            Real stories from the creator economy trenches. 💸
          </span>
        </p>

        <p className="text-base sm:text-lg text-muted-foreground/80 mb-8 max-w-xl mx-auto italic">
          No overnight success stories. No passive income miracles. Just honest experiments, account bans, and figuring out the internet one WTF moment at a time.
        </p>

        {/* Кнопки подгрузятся позже, не блокируют LCP */}
        <HeroButtons />
      </div>
    </section>
  )
}