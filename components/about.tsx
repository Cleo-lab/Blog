'use client'
import Image from 'next/image'

interface AboutProps { readonly language: string }

const content = {
  en: {
    title: 'About Me',
    bio: [
      "Hey! 😄 I'm Yurie, and this is my personal blog about online experiments, side hustles, and learning how the internet actually works – not how influencers pretend it does.",
      "Here I write about building projects from scratch, the creator economy, adult platforms, AI tools, web development, and what happens when curiosity meets algorithms. Some stories are funny, some are uncomfortable, and some accidentally turn into technical deep dives.",
      "This blog is not about overnight success, passive income, or motivational quotes. It’s about real experiences: failed ideas, unexpected growth, account bans, analytics spikes, bad UX decisions, and figuring things out by trial and error.",
      "If you’re interested in personal blogging, digital platforms, content creation, AI experiments, web development, and honest storytelling about the modern internet — you’re in the right place.",
      "No gurus. No courses. No fake success stories.\nJust experiments, data, mistakes, and lessons learned in public.✨"
    ],
    stats: [
      // укажи реальные размеры своих файлов
      { image: '/shh.jpeg',   w: 1200, h: 900, label: 'Experiments', value: 'Testing side hustle theories' },
      { image: '/truth.jpeg', w: 1200, h: 900, label: 'Hot Takes',   value: 'Uncomfortable digital truths' }
    ]
  },
  es: {
    title: 'Acerca de Mí',
    bio: [
      "¡Hola! 😄 Soy Yurie, y este es mi blog personal sobre experimentos en línea, trabajos secundarios y aprender cómo funciona realmente internet — no cómo los influencers pretenden que funcione.",
      "Aquí escribo sobre construir proyectos desde cero, la economía de los creadores, plataformas para adultos, herramientas de IA, desarrollo web y lo que sucede cuando la curiosidad se encuentra con los algoritmos. Algunas historias son divertidas, otras incómodas, y algunas accidentalmente se convierten en análisis técnicos profundos.",
      "Este blog no trata sobre el éxito de la noche a la mañana, ingresos pasivos o frases motivacionales. Se trata de experiencias reales: ideas fallidas, crecimiento inesperado, cuentas bloqueadas, picos de analíticas, malas decisiones de UX y aprender a base de prueba y error.",
      "Si te interesa el blogging personal, las plataformas digitales, la creación de contenido, experimentos con IA, desarrollo web y relatos honestos sobre internet moderno — estás en el lugar correcto.",
      "Sin gurús. Sin cursos. Sin historias de éxito falsas.\nSolo experimentos, datos, errores y lecciones aprendidas en público. ✨"
    ],
    stats: [
      { image: '/shh.jpeg',   w: 1200, h: 900, label: 'Experimentos', value: 'Probando teorías de negocios' },
      { image: '/truth.jpeg', w: 1200, h: 900, label: 'Realidad Pura', value: 'Verdades digitales incómodas' }
    ]
  }
}

export default function About({ language }: AboutProps) {
  const t = content[language as keyof typeof content] || content.en

  return (
    <section className="py-8 sm:py-12 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* заголовок */}
        <div>
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
        </div>

        {/* текстовая карточка */}
        <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 shadow-lg relative overflow-hidden text-balance">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="text-lg text-foreground/80 leading-relaxed space-y-4 relative z-10 text-justify">
            {t.bio.map((p, i) => (
              <p key={i} className="whitespace-pre-line">{p}</p>
            ))}
          </div>
        </div>

        {/* картинки без рамок-обводок и лишних блоков */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {t.stats.map((item) => (
    <figure key={item.label} className="group w-full max-w-3xl mx-auto">
      <Image
        src={item.image}
        alt={item.label}
        width={item.w}
        height={item.h}
        loading="lazy"
        sizes="(max-width: 640px) 100vw, 50vw"
        className="w-full h-auto rounded-2xl"
      />
      <figcaption className="mt-3 text-center">
        <span className="text-sm font-bold uppercase text-pink-500">/{item.label}</span>
        <p className="text-xs text-foreground/70">{item.value}</p>
      </figcaption>
    </figure>
  ))}
</div>
      </div>
    </section>
  )
}