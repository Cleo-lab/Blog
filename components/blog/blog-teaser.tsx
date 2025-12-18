// components/blog/blog-teaser.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Lock, UserPlus, Sparkles } from 'lucide-react';

export default function BlogTeaser({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="w-full max-w-[280px] animate-in zoom-in duration-700">
      {/* Основная карточка с эффектом мягкого стекла */}
      <div className="relative overflow-hidden rounded-[3rem] border border-white/40 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl p-8 shadow-[0_20px_50px_rgba(255,182,193,0.3)] text-center">
        
        {/* Декоративное розовое свечение сзади */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-400/30 blur-[40px] rounded-full" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-400/30 blur-[40px] rounded-full" />

        <div className="relative z-10 space-y-5">
          {/* Иконка */}
          <div className="inline-flex p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-pink-500/20">
            <Lock className="w-8 h-8 text-white animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tighter uppercase italic bg-gradient-to-br from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Private
            </h3>
            <p className="text-[11px] text-purple-900/70 dark:text-pink-100/70 font-bold uppercase tracking-widest leading-tight">
              Unlock the full feed & secret sketches
            </p>
          </div>

          <Button 
            onClick={onSignIn} 
            className="w-full font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl h-12 shadow-lg shadow-pink-500/30 transition-all hover:scale-105"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Join Now
          </Button>

          <div className="flex items-center justify-center gap-1 text-[9px] text-pink-600 dark:text-pink-400 font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3" />
            Free for everyone
          </div>
        </div>
      </div>
    </div>
  );
}