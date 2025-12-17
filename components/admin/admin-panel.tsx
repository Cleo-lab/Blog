// components/admin/admin-panel.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlogPostsManager from './blog-posts-manager';
import GalleryManager from './gallery-manager';
import CommentsManager from './comments-manager';
import NewsletterManager from './newsletter-manager';
import AboutManager from './about-manager';
import DonationsManager from './donations-manager';
import { ArrowLeft } from 'lucide-react';
import { useSupabase } from '@/hooks/use-supabase';
// >>> ДОБАВЛЕН useRouter <<<
import { useSearchParams, useRouter } from 'next/navigation'; 

interface AdminPanelProps {
  readonly setCurrentSection?: (section: string) => void;
}

export default function AdminPanel({ setCurrentSection }: AdminPanelProps) {
  const supabase = useSupabase();
  const searchParams = useSearchParams();
  const router = useRouter(); // Инициализируем роутер

  // 1. Начинаем с чтения из URL (/?tab=...)
  const initialTabFromUrl = searchParams.get('tab') ?? 'blog';

  // 2. Определяем финальное начальное состояние с учетом localStorage
  let finalInitialTab = initialTabFromUrl;
  
  if (typeof window !== 'undefined') {
      const storedReturnTab = window.localStorage.getItem('adminReturnTab');
      if (storedReturnTab) {
          finalInitialTab = storedReturnTab; // Используем сохраненную вкладку
          window.localStorage.removeItem('adminReturnTab'); // ОЧИЩАЕМ сразу после прочтения
      }
      // Оставим старую логику для совместимости, если она была (если нет - можно удалить)
      const savedTabOld = window.localStorage.getItem('adminTab');
      if (savedTabOld) {
        finalInitialTab = savedTabOld;
        window.localStorage.removeItem('adminTab');
      }
  }

  // 3. Инициализируем стейт один раз
  const [activeTab, setActiveTab] = useState(() => {
  const urlTab = searchParams.get('tab');
  if (urlTab) return urlTab;
  
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('adminReturnTab');
    if (stored) {
      localStorage.removeItem('adminReturnTab');
      return stored;
    }
  }
  return 'blog';
});

  // 4. Счётчики (оставлены для полноты)
  const [unread, setUnread] = useState(0);
  const [pendingDonationsCount, setPendingDonationsCount] = useState(0);

  // 5. Синхронизация состояния с URL-параметрами
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  // 6. Функция смены таба, которая ОБЯЗАТЕЛЬНО обновляет URL
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    // Обновляем URL, чтобы при перезагрузке он открыл нужную вкладку
    router.push(`/?tab=${newTab}`, { scroll: false });
  };

  // ... (Остальные useEffect для счетчиков unread/pendingDonationsCount) ...
  // Счётчик PENDING донатов
  useEffect(() => {
    const getPendingDonations = async () => {
      const { count } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      setPendingDonationsCount(count ?? 0);
    };
    getPendingDonations();
  }, [supabase]);

  // Кол-во непрочитанных комментариев
  useEffect(() => {
    (async () => {
      const { count } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      setUnread(count ?? 0);
    })();
  }, [supabase]);
  // -----------------------------------------------------------------

  return (
    <section className="min-h-[calc(100vh-4rem)] py-8 px-4 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Blog Management
            </h1>
            <p className="text-foreground/60">Manage all aspects of your blog</p>
          </div>
          <Button
            onClick={() => setCurrentSection?.('home')}
            variant="outline"
            className="border-border/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>

        <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full justify-start border-b border-border/50 bg-muted/30 rounded-none p-0 h-auto">
              <TabsTrigger value="blog" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Blog Posts</TabsTrigger>
              <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">About</TabsTrigger>
              <TabsTrigger value="gallery" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Gallery</TabsTrigger>
              <TabsTrigger value="comments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary relative">
                Comments
                {unread > 0 && (
                  <span className="absolute -top-1 -right-3 bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {unread}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="donations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary relative">
                Donations
                {pendingDonationsCount > 0 && (
                    <span className="absolute -top-1 -right-3 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {pendingDonationsCount}
                    </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Newsletter</TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="blog" className="m-0"><BlogPostsManager /></TabsContent>
              <TabsContent value="about" className="m-0"><AboutManager /></TabsContent>
              <TabsContent value="gallery" className="m-0"><GalleryManager /></TabsContent>
              <TabsContent value="comments" className="m-0"><CommentsManager /></TabsContent>
              <TabsContent value="donations" className="m-0"><DonationsManager /></TabsContent>
              <TabsContent value="newsletter" className="m-0"><NewsletterManager /></TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}