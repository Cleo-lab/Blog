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
import { ArrowLeft, BarChart3, Eye, Users, TrendingUp } from 'lucide-react';
import { useSupabase } from '@/hooks/use-supabase';
import { useSearchParams, useRouter } from 'next/navigation'; 

interface AdminPanelProps {
  readonly setCurrentSection?: (section: string) => void;
}

export default function AdminPanel({ setCurrentSection }: AdminPanelProps) {
  const supabase = useSupabase();
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Инициализация вкладок
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

  // 2. Состояния для счётчиков и статистики
  const [unread, setUnread] = useState(0);
  const [pendingDonationsCount, setPendingDonationsCount] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  // 3. Синхронизация таба с URL
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    router.push(`/?tab=${newTab}`, { scroll: false });
  };

  // 4. Получение статистики (Views)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count, error } = await supabase
          .from('page_views')
          .select('*', { count: 'exact', head: true })
          .eq('is_admin_view', false);
        
        if (error) throw error;
        setTotalViews(count ?? 0);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    
    if (activeTab === 'statistics') {
      fetchStats();
    }
  }, [supabase, activeTab]);

  // 5. Счётчик PENDING донатов
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

  // 6. Счётчик непрочитанных комментариев
  useEffect(() => {
    (async () => {
      const { count } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      setUnread(count ?? 0);
    })();
  }, [supabase]);

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
            <TabsList className="w-full justify-start border-b border-border/50 bg-muted/30 rounded-none p-0 h-auto flex-wrap">
              <TabsTrigger value="blog" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-6">Blog Posts</TabsTrigger>
              <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-6">About</TabsTrigger>
              <TabsTrigger value="gallery" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-6">Gallery</TabsTrigger>
              <TabsTrigger value="comments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-6 relative">
                Comments
                {unread > 0 && (
                  <span className="absolute top-2 right-1 bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {unread}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="donations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-6 relative">
                Donations
                {pendingDonationsCount > 0 && (
                    <span className="absolute top-2 right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {pendingDonationsCount}
                    </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-6">Newsletter</TabsTrigger>
              
              {/* НОВАЯ ВКЛАДКА: Statistics */}
              <TabsTrigger value="statistics" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-6 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Statistics
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="blog" className="m-0"><BlogPostsManager /></TabsContent>
              <TabsContent value="about" className="m-0"><AboutManager /></TabsContent>
              <TabsContent value="gallery" className="m-0"><GalleryManager /></TabsContent>
              <TabsContent value="comments" className="m-0"><CommentsManager /></TabsContent>
              <TabsContent value="donations" className="m-0"><DonationsManager /></TabsContent>
              <TabsContent value="newsletter" className="m-0"><NewsletterManager /></TabsContent>
              
              {/* КОНТЕНТ ВКЛАДКИ СТАТИСТИКИ */}
              <TabsContent value="statistics" className="m-0 space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Карточка: Всего просмотров */}
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <Eye className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Total Views</p>
                      <h3 className="text-3xl font-bold tracking-tight">{totalViews}</h3>
                    </div>
                  </div>

                  {/* Заглушка: Посетители */}
                  <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4 opacity-60">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Unique Visitors</p>
                      <h3 className="text-3xl font-bold tracking-tight">--</h3>
                    </div>
                  </div>

                  {/* Заглушка: Аналитика */}
                  <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10 flex items-center gap-4 opacity-60">
                    <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Engagement</p>
                      <h3 className="text-3xl font-bold tracking-tight italic text-sm">Coming Soon</h3>
                    </div>
                  </div>
                </div>

                {/* Информационный блок */}
                <div className="bg-muted/20 p-12 rounded-3xl border border-dashed border-border/50 flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm text-primary/40">
                      <BarChart3 className="w-8 h-8" />
                   </div>
                   <h4 className="font-bold text-xl mb-2">Detailed Analytics is under development</h4>
                   <p className="max-w-md text-sm text-muted-foreground">
                     Soon you will be able to see daily traffic charts, popular posts and where your visitors are coming from.
                   </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}