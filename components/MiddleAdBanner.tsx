'use client';

export default function TopAdStrip() {
  return (
    <aside
      className="
        /* размеры: длинный и низкий */
        w-full max-w-4xl h-[90px]
        /* центрирование + отступы сверху/снизу */
        mx-auto my-8
        /* внешний вид */
        bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600
        rounded-xl shadow-md
        /* содержимое по центру */
        flex items-center justify-center
        text-white text-center
        /* hover-эффект */
        hover:shadow-lg transition-shadow
      "
    >
      <div className="flex items-center gap-4 px-6">
        {/* иконка следа */}
        <span className="text-3xl">✨</span>

        <div className="flex-1">
          <p className="text-lg font-semibold drop-shadow-sm">
            Fantasy readers wanted
          </p>
          <p className="text-sm opacity-90">
            728×90 px • CPC $0.45
          </p>
        </div>

        <a
          href="mailto:your@email.com?subject=Ad%20spot%20728x90"
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md text-sm font-medium transition"
        >
          Contact me
        </a>
      </div>
    </aside>
  );
}



