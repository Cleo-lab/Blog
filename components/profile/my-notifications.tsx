// components/profile/my-notifications.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useSupabase } from '@/hooks/use-supabase';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  source_title: string;
  source_url: string;
}

interface ReplyData {
  id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  source_type: string;
  source_id: string;
}

export default function MyNotifications() {
  const { user } = useAuth();
  const supabase = useSupabase();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    loadNotifications();
  }, [user, supabase]);

  const loadNotifications = async () => {
    // все ответы на комменты пользователя
    const { data: replies } = await supabase
      .from('comments')
      .select('id, content, created_at, is_read, source_type, source_id')
      .not('parent_id', 'is', null) // это ответ
      .eq('is_read', false);        // непрочитанные

    if (!replies) return;

    const enriched = await Promise.all(
      replies.map(async (r: ReplyData) => {
        const table = r.source_type === 'blog' ? 'blog_posts' : 'gallery';
        const { data: src } = await supabase
          .from(table)
          .select('title, slug')
          .eq(r.source_type === 'blog' ? 'slug' : 'id', r.source_id)
          .single();
        return {
          id: r.id,
          content: r.content,
          created_at: r.created_at,
          is_read: r.is_read,
          source_title: src?.title || 'Untitled',
          source_url: r.source_type === 'blog' ? `/blog/${src?.slug}` : `/gallery/${r.source_id}`,
        };
      })
    );

    setNotifications(enriched);
  };

  const markRead = async (id: string) => {
    await supabase.from('comments').update({ is_read: true }).eq('id', id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!notifications.length)
    return (
      <div className="text-center py-6 text-foreground/60">
        <MessageSquare className="w-8 h-8 mx-auto mb-2" />
        <p>No new replies yet.</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <MessageSquare className="w-5 h-5" /> Notifications ({notifications.length})
      </h3>
      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className="p-4 relative border-l-4 border-l-red-500">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm text-foreground/80 leading-relaxed">{n.content}</p>
                <p className="text-xs text-foreground/60 mt-1">
                  on <a href={n.source_url} className="underline">{n.source_title}</a> • {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </p>
              </div>
              <button
                onClick={() => markRead(n.id)}
                className="text-foreground/40 hover:text-foreground"
                title="Mark as read"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}