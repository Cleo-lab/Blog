'use client'

interface AboutProps {
  readonly language: string;
}

const content = {
  en: {
    title: 'About Me',
    bio: `Hey! 😄 I'm Yurie, a cheerful anime girl with a fiery streak and a love for adventures big and small. Most days, I'm laughing, exploring, and just enjoying life… but don't get me angry! ⚔️✨

I wear medieval armor because the world can be unpredictable, and my sword has helped me out more times than I can count. Sometimes I even use a little magic.

I love anime, painting, video games, magic, cats, and all kinds of animals — they make life more fun and colorful. I'm kind and playful when everyone is safe, but if I see injustice or cruelty, my fiery side comes out. 🔥

Stick around my blog for stories, adventures, a little chaos… and of course, a lot of fun! 💖`
  },
  es: {
    title: 'Acerca de Mí',
    bio: `¡Hola! 😄 Soy Yurie, una chica de anime alegre con un toque explosivo y amor por las aventuras grandes y pequeñas. La mayoría de los días estoy riendo, explorando y disfrutando de la vida… ¡pero no me hagas enfadar! ⚔️✨

Llevo armadura medieval porque el mundo puede ser impredecible, y mi espada me ha ayudado más veces de las que puedo contar. A veces incluso uso un poco de magia.

Me encantan el anime, la pintura, los videojuegos, la magia, los gatos y todo tipo de animales — hacen la vida más divertida y colorida. Soy amable y juguetona cuando todos están seguros, pero si veo injusticia o crueldad, sale mi lado explosivo. 🔥

Sigue mi blog para historias, aventuras, un poco de caos… ¡y, por supuesto, mucha diversión! 💖`
  }
}

export default function About({ language }: AboutProps) {
  const t = content[language as keyof typeof content] || content.en

  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.title}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-8" />
          </div>

          <div className="bg-card rounded-2xl p-8 sm:p-12 border border-border/50 shadow-lg">
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">{t.bio}</p>
            <p className="text-lg text-foreground/70 leading-relaxed">
              On this blog, you&apos;ll find my personal musings, fan artwork, travel stories, and everything that makes my heart sparkle. Whether you&apos;re here for the anime discussions, photography, or just some cozy content, I&apos;m glad you stopped by!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '✨', label: 'Creative', value: 'Arts & Stories' },
              { icon: '💭', label: 'Thoughtful', value: 'Deep Insights' },
              { icon: '🌸', label: 'Cozy', value: 'Warm Community' }
            ].map((item, idx) => (
              <div
                key={idx} // ← SonarCloud: вместо item.label
                className="bg-card rounded-xl p-6 border border-border/50 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{item.label}</h3>
                <p className="text-sm text-foreground/60">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}