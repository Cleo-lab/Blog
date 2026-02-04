'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, MessageSquare, Award, 
  Heart, Bell, LogOut, Camera, Loader2, ArrowLeft 
} from 'lucide-react';
import { useSupabase } from '@/hooks/use-supabase';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// Импорты твоих под-компонентов (проверь пути!)
import MyAchievements from '@/components/profile/my-achievements';
import MyFavourites from '@/components/profile/my-favourites';
import MyNotifications from '@/components/profile/my-notifications';
import MyComments from '@/components/profile/my-comments';

export default function DashboardPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { toast } = useToast();
  const supabase = useSupabase();
  const router = useRouter();

  // 1. Загрузка данных профиля
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push('/?section=signin'); // Если не залогинен — на главную к форме входа
        return;
      }

      setUserId(user.id);
      setEmail(user.email || '');

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        setUsername(profile.username || '');
        setAvatarUrl(profile.avatar_url || '');
      }
    } catch (error: any) {
      console.error('Profile load error:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // 2. Функция смены аватара
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Error', description: 'Image too large (max 2MB)', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      const newAvatarUrl = data.publicUrl;
      setAvatarUrl(newAvatarUrl);
      
      await supabase.from('profiles').upsert({ 
        id: userId, 
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString() 
      });
      
      toast({ title: 'Success', description: 'Avatar updated!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  // 3. Функция сохранения профиля
  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          username: username.trim(),
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({ title: 'Success', description: 'Profile updated ✨' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
      <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
      <p className="text-muted-foreground animate-pulse font-medium">Loading your dashboard...</p>
    </div>
  );

  return (
    <section className="min-h-screen py-12 px-4 bg-gradient-to-b from-background via-pink-500/5 to-background">
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-pink-500 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
              User Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage your presence and activity</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="rounded-full gap-2 border-pink-500/20">
            <LogOut className="w-4 h-4 text-red-500" /> Sign Out
          </Button>
        </div>

        {/* Identity Settings */}
        <div className="bg-card/50 backdrop-blur-md rounded-[2.5rem] border border-border/50 p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-pink-500/10 rounded-lg">
              <User className="w-5 h-5 text-pink-500" />
            </div>
            <h2 className="text-2xl font-bold">Identity</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center gap-4">
              <div className="group relative w-40 h-40 rounded-full bg-muted overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl transition-transform hover:scale-105">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl bg-zinc-800 text-white">👤</div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/70">Username</label>
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-2xl border-border/50 bg-background/50"
                  placeholder="How should we call you?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/70 opacity-50">Email (Private)</label>
                <Input value={email} disabled className="rounded-2xl bg-muted/30 border-dashed cursor-not-allowed" />
              </div>
              <Button 
                onClick={handleSave} 
                disabled={saving || uploading} 
                className="bg-pink-600 hover:bg-pink-500 text-white rounded-full px-8 shadow-lg shadow-pink-500/20"
              >
                {saving ? 'Saving...' : 'Update Profile'}
              </Button>
            </div>
          </div>
        </div>

        {/* Discussion History */}
        <div className="bg-card/50 backdrop-blur-md rounded-[2.5rem] border border-border/50 p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold">Discussion History</h2>
          </div>
          <MyComments />
        </div>

        {/* Badges & Alerts */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card/50 backdrop-blur-md rounded-[2.5rem] border border-border/50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl font-bold">Badges</h2>
            </div>
            <MyAchievements />
          </div>

          <div className="bg-card/50 backdrop-blur-md rounded-[2.5rem] border border-border/50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-bold">Recent Alerts</h2>
            </div>
            <MyNotifications />
          </div>
        </div>

        {/* Saved Stories */}
        <div className="bg-card/50 backdrop-blur-md rounded-[2.5rem] border border-border/50 p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">Saved Stories</h2>
          </div>
          <MyFavourites />
        </div>

      </div>
    </section>
  );
}