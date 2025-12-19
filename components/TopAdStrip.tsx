// components/TopAdStrip.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TopAdStrip() {
  const { isLoggedIn, email } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');

  // Определяем тип частиц на основе статуса авторизации
  // Гость (isLoggedIn: false) -> звезды ('star')
  // Пользователь (isLoggedIn: true) -> сердечки ('heart')
  const particleType = isLoggedIn ? 'heart' : 'star';

  // Персональный текст
  useEffect(() => {
    if (!isLoggedIn) {
      setText('Welcome to digital dreams! Register and feel at home.');
      return;
    }
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('no user');
        
        const { data } = await supabase.from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
          
        const name = data?.username || email?.split('@')[0] || 'friend';
        const phrases = [
          `Nice to see you here, ${name}!`,
          `You make this blog alive, ${name}!`,
          `Welcome back, ${name} — let's create!`,
          `Your energy inspires, ${name}!`,
        ];
        setText(phrases[Math.floor(Math.random() * phrases.length)]);
      } catch {
        setText('Welcome back, friend!');
      }
    })();
  }, [isLoggedIn, email]);

  // Canvas-анимация
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const updateSize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    updateSize();

    let raf = 0;
    type P = { x: number; y: number; vx: number; vy: number; life: number; size: number; shape: 'star' | 'heart' };
    const items: P[] = [];

    const spawn = (x: number, y: number) => {
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 2;
        items.push({ 
          x, 
          y, 
          vx: Math.cos(angle) * speed, 
          vy: Math.sin(angle) * speed, 
          life: 1, 
          size: Math.random() * 6 + 6, 
          shape: particleType // Используем динамически вычисленный тип
        });
      }
    };

    const drawStar = (x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const x1 = x + Math.cos(a) * size;
        const y1 = y + Math.sin(a) * size;
        if (i === 0) ctx.moveTo(x1, y1); else ctx.lineTo(x1, y1);
        const a2 = ((i + 2) * Math.PI * 2) / 5 - Math.PI / 2;
        const x2 = x + Math.cos(a2) * size * 0.5;
        const y2 = y + Math.sin(a2) * size * 0.5;
        ctx.lineTo(x2, y2);
      }
      ctx.closePath(); 
      ctx.fill();
    };

    const drawHeart = (x: number, y: number, size: number) => {
      ctx.beginPath();
      const top = y - size / 4;
      ctx.moveTo(x, y + size / 4);
      ctx.bezierCurveTo(x, top, x - size / 2, top, x - size / 2, y);
      ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size / 2, x, y + size);
      ctx.bezierCurveTo(x, y + size / 2, x + size / 2, y + size / 2, x + size / 2, y);
      ctx.bezierCurveTo(x + size / 2, top, x, top, x, y + size / 4);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      for (let i = items.length - 1; i >= 0; i--) {
        const p = items[i];
        p.x += p.vx; 
        p.y += p.vy; 
        p.vy += 0.05; 
        p.life -= 0.02;
        
        // Устанавливаем цвет в зависимости от формы
        ctx.fillStyle = p.shape === 'heart' ? '#ec4899' : '#fbbf24'; 
        ctx.globalAlpha = p.life;
        
        if (p.shape === 'star') {
          drawStar(p.x, p.y, p.size);
        } else {
          drawHeart(p.x, p.y, p.size);
        }
        
        if (p.life <= 0) items.splice(i, 1);
      }
      
      ctx.globalAlpha = 1;
      
      if (items.length > 0) {
        raf = requestAnimationFrame(animate);
      } else {
        raf = 0;
      }
    };

    const handleInteraction = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      spawn(x, y);
      if (!raf) {
        raf = requestAnimationFrame(animate);
      }
    };

    const banner = bannerRef.current;
    banner?.addEventListener('click', handleInteraction);
    banner?.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('resize', updateSize);
    
    return () => {
      cancelAnimationFrame(raf);
      banner?.removeEventListener('click', handleInteraction);
      banner?.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('resize', updateSize);
    };
  }, [particleType]); // Перезапускаем эффект при изменении типа частиц

  return (
    <aside
      ref={bannerRef}
      className="relative w-full h-[80px] bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 overflow-hidden rounded-none cursor-pointer select-none"
    >
      {/* Фоновый волнистый SVG */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#fff" d="M0,70 C240,20 480,5 720,25 C960,45 1200,30 1440,50 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* Canvas для частиц */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Текст приветствия */}
      <div className="relative z-10 flex items-center justify-center h-full text-white text-center px-6">
        <p
          className={`text-xl md:text-2xl font-semibold drop-shadow-lg transition-transform ${
            isLoggedIn ? 'animate-pulse' : ''
          }`}
        >
          {text}
        </p>
      </div>
    </aside>
  );
}