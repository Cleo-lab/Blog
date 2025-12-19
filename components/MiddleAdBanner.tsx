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
        Thank you for being here.
          </p>
        </div>
      </div>
    </aside>
  );
}



