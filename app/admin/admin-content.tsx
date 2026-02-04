'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BarChart3, Eye, Loader2, ShieldAlert } from 'lucide-react';

import { useSupabase } from '@/hooks/use-supabase';
import { useToast } from '@/hooks/use-toast';

import BlogPostsManager from '@/components/admin/blog-posts-manager';
import GalleryManager from '@/components/admin/gallery-manager';
import CommentsManager from '@/components/admin/comments-manager';
import NewsletterManager from '@/components/admin/newsletter-manager';
import AboutManager from '@/components/admin/about-manager';
import DonationsManager from '@/components/admin/donations-manager';
import AnalyticsChart from '@/components/admin/analytics-chart';

const STYLES = {
  tab: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6 font-bold text-xs uppercase tracking-widest transition-all",
  badgePink: "absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full border-2 border-background",
  badgeRed: "absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full border-2 border-background",
  statCard: "p-6 rounded-3xl bg-primary/5 border border-primary/10 shadow-sm",
  statLabel: "text-[10px] text-muted-foreground uppercase font-black tracking-tighter"
};

export default function AdminContent() {
  const supabase = useSupabase();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unread, setUnread] = useState(0);
  const [pendingDonationsCount, setPendingDonationsCount] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  const checkAdminAccess = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');  // ← исправлено: /login вместо /?section=signin
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_admin) {
        toast({ title: "Access Denied", description: "Admins only!", variant: "destructive" });
        router.push('/dashboard');
        return;
      }

      setIsAdmin(true);
    } catch (err) {
      console.error(err);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [supabase, router, toast]);

  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]);

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'blog');

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    router.push(`/admin?tab=${newTab}`, { scroll: false });
  };

  useEffect(() => {
    if (!isAdmin) return;

    const fetchAdminData = async () => {
      const { count: views } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('is_admin_view', false);
      setTotalViews(views ?? 0);

      const { count: comms } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      setUnread(comms ?? 0);

      const { count: dons } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      setPendingDonationsCount(dons ?? 0);
    };

    fetchAdminData();
  }, [supabase, isAdmin]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="font-medium text-muted-foreground">Verifying authority...</p>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <section className="min-h-screen py-8 px-4 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                Admin Control
              </h1>
              <p className="text-muted-foreground">The master key to Yurie's Blog</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" className="rounded-full gap-2 border-border/50">
              <ArrowLeft className="w-4 h-4" /> Exit to Site
            </Button>
          </Link>
        </div>

        <div className="bg-card rounded-[2rem] border border-border/50 shadow-2xl overflow-hidden">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full justify-start border-b border-border/50 bg-muted/20 rounded-none p-0 h-auto flex-wrap">
              <TabsTrigger value="blog" className={STYLES.tab}>Blog Posts</TabsTrigger>
              <TabsTrigger value="about" className={STYLES.tab}>About</TabsTrigger>
              <TabsTrigger value="gallery" className={STYLES.tab}>Gallery</TabsTrigger>
              <TabsTrigger value="comments" className={`${STYLES.tab} relative`}>
                Comments
                {unread > 0 && <span className={STYLES.badgePink}>{unread}</span>}
              </TabsTrigger>
              <TabsTrigger value="donations" className={`${STYLES.tab} relative`}>
                Donations
                {pendingDonationsCount > 0 && <span className={STYLES.badgeRed}>{pendingDonationsCount}</span>}
              </TabsTrigger>
              <TabsTrigger value="newsletter" className={STYLES.tab}>Newsletter</TabsTrigger>
              <TabsTrigger value="statistics" className={`${STYLES.tab} flex items-center gap-2`}>
                <BarChart3 className="w-4 h-4" /> Statistics
              </TabsTrigger>
            </TabsList>

            <div className="p-8">
              <TabsContent value="blog"><BlogPostsManager /></TabsContent>
              <TabsContent value="about"><AboutManager /></TabsContent>
              <TabsContent value="gallery"><GalleryManager /></TabsContent>
              <TabsContent value="comments"><CommentsManager /></TabsContent>
              <TabsContent value="donations"><DonationsManager /></TabsContent>
              <TabsContent value="newsletter"><NewsletterManager /></TabsContent>
              
              <TabsContent value="statistics" className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={STYLES.statCard}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary"><Eye /></div>
                      <div>
                        <p className={STYLES.statLabel}>Total Views</p>
                        <h3 className="text-3xl font-bold">{totalViews}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-background/50 rounded-3xl border border-border/50 p-6">
                  <AnalyticsChart />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}