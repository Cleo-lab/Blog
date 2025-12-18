'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSupabase } from '@/hooks/use-supabase';

interface AnalyticsTrackerProps {
  isAdmin: boolean;
}

export default function AnalyticsTracker({ isAdmin }: AnalyticsTrackerProps) {
  const supabase = useSupabase();
  const pathname = usePathname();

  useEffect(() => {
    // Если это админ — ничего не записываем
    if (isAdmin) return;

    const trackView = async () => {
      try {
        await supabase.from('page_views').insert([
          { 
            page_path: pathname, 
            is_admin_view: false 
          }
        ]);
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    };

    trackView();
  }, [pathname, isAdmin, supabase]);

  return null; // Компонент ничего не рендерит, он только выполняет логику
}