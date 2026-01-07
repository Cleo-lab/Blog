'use client'

interface AboutProps {
  readonly language: string;
}

const content = {
  en: {
    title: 'About Me',
    // ✅ Разбиваем на массив, чтобы создать реальные абзацы
    bio: [
      "Hey! 😄 I'm Yurie, and this is my personal blog about online experiments, side hustles, and learning how the internet actually works - not how influencers pretend it does.",
      "Here I write about building projects from scratch, the creator economy, adult platforms, AI tools, web development, and what happens when curiosity meets algorithms. Some stories are funny, some are uncomfortable, and some accidentally turn into technical deep dives.",
      "This blog is not about overnight success, passive income, or motivational quotes. It’s about real experiences: failed ideas, unexpected growth, account bans, analytics spikes, bad UX decisions, and figuring things out by trial and error.",
      "If you’re interested in personal blogging, digital platforms, content creation, AI experiments, web development, and honest storytelling about the modern internet — you’re in the right place.",
      "No gurus. No courses. No fake success stories.\nJust experiments, data, mistakes, and lessons learned in public.✨"
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
    ]
  }
}

export default function About({ language }: AboutProps) {
  const t = content[language as keyof typeof content] || content.en

  return (
    <section className="py-8 sm:py-12 px-4 bg-gradient-to-b from-background via-muted/2 to-background">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8"> {/* Увеличил отступы */}
          <div>
            {/* Если это отдельная страница /about, замени h2 на h1 */}
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.title}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-6" />
          </div>

          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 shadow-lg">
            {/* ✅ Рендерим каждый абзац отдельно. Это лучше для SEO и чтения */}
            <div className="text-lg text-foreground/80 leading-relaxed space-y-4">
              {t.bio.map((paragraph, index) => (
                // whitespace-pre-line сохранит перенос строки внутри последнего абзаца
                <p key={index} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '✨', label: 'Creative', value: 'Arts & Stories' },
              { icon: '💭', label: 'Thoughtful', value: 'Deep Insights' },
              { icon: '🌸', label: 'Cozy', value: 'Warm Community' }
            ].map((item, idx) => (
              <div
                key={idx}
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