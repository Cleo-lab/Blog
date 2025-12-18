// components/profile/user-profile.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, User, MessageSquare, Award, Heart, Bell } from 'lucide-react';
import { useSupabase } from '@/hooks/use-supabase';
import { useToast } from '@/hooks/use-toast';
import MyAchievements from './my-achievements';
import MyFavourites from './my-favourites';
import MyNotifications from './my-notifications';

interface UserProfileProps {
  setCurrentSection?: (section: string) => void;
  onProfileUpdate?: () => void;
}

export default function UserProfile({ setCurrentSection, onProfileUpdate }: UserProfileProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { toast } = useToast();
  const supabase = useSupabase();

  // Используем useCallback, чтобы избежать лишних перерисовок
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);
      setEmail(user.email || '');

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .maybeSingle(); // Используем maybeSingle вместо single, чтобы не падать в ошибку

      if (profile) {
        setUsername(profile.username || '');
        setAvatarUrl(profile.avatar_url || '');
      }
    } catch (error: any) {
      console.error('Profile load error:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    try {
      const fileName = `${userId}/${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
      onProfileUpdate?.();
      toast({ title: 'Success', description: 'Avatar updated' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: username.trim(), avatar_url: avatarUrl })
        .eq('id', userId);
      if (error) throw error;
      onProfileUpdate?.();
      toast({ title: 'Success', description: 'Profile saved' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted-foreground animate-pulse">Loading profile...</p>
    </div>
  );

  return (
    <section className="min-h-screen py-12 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto space-y-20 pb-20">
        
        {/* СЕКЦИЯ 1: ДАННЫЕ (ID: profile-info) */}
        <div id="profile-info" className="scroll-mt-24 bg-card rounded-3xl border border-border/50 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <User className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Personal Settings</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-muted overflow-hidden border-4 border-card shadow-xl">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-muted">👤</div>
                )}
              </div>
              <input type="file" id="avatar-input" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <Button variant="outline" size="sm" onClick={() => document.getElementById('avatar-input')?.click()} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Change Photo'}
              </Button>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium opacity-50">Email (Fixed)</label>
                <Input value={email} disabled className="bg-muted/50" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={saving}>Save Changes</Button>
                <Button variant="ghost" onClick={() => setCurrentSection?.('home')}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>

        {/* СЕКЦИЯ 2: КОММЕНТАРИИ (ID: profile-comments) */}
        <div id="profile-comments" className="scroll-mt-24 bg-card rounded-3xl border border-border/50 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">My Comments</h2>
          </div>
          <div className="p-10 text-center text-muted-foreground border-2 border-dashed rounded-2xl">
            Comment history will appear here soon.
          </div>
        </div>

        {/* СЕКЦИЯ 3: ДОСТИЖЕНИЯ (ID: profile-achievements) */}
        <div id="profile-achievements" className="scroll-mt-24 bg-card rounded-3xl border border-border/50 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Achievements</h2>
          </div>
          <MyAchievements />
        </div>

        {/* СЕКЦИЯ 4: ИЗБРАННОЕ (ID: profile-favourites) */}
        <div id="profile-favourites" className="scroll-mt-24 bg-card rounded-3xl border border-border/50 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Favourites</h2>
          </div>
          <MyFavourites />
        </div>

        {/* СЕКЦИЯ 5: УВЕДОМЛЕНИЯ (ID: profile-notifications) */}
        <div id="profile-notifications" className="scroll-mt-24 bg-card rounded-3xl border border-border/50 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Notifications</h2>
          </div>
          <MyNotifications />
        </div>

      </div>
    </section>
  );
}