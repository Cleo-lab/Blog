'use client';

export default function FootAdBanner() {
  return (
    <aside className="w-full h-[100px] bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 relative overflow-hidden">
      {/* фоновый узор «аниме-облака» (не грузит) */}
      <div className="absolute inset-0 opacity-20">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            fill="#fff"
            d="M0,70 C240,20 480,5 720,25 C960,45 1200,30 1440,50 L1440,100 L0,100 Z"
          />
        </svg>
      </div>

      {/* контент по центру */}
      <div className="relative z-10 h-full flex items-center justify-center text-white">
        <span className="text-3xl">✨</span>
        <p className="text-xl sm:text-2xl font-semibold drop-shadow-md text-balance text-center px-4">
          Gracias por estar aquí.
        </p>
      </div>
    </aside>
  );
}