// components/notifications-bell.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useSupabase } from '@/hooks/use-supabase';
import { Bell, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsBell() {
  const { user } = useAuth();
  const supabase = useSupabase();
  const [count, setCount] = useState(0);
  const [list, setList] = useState<any[]>([]);

  // считаем непрочитанные ответы на мои комменты
  const fetchCount = async () => {
    if (!user) return;
    const { count } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .not('parent_id', 'is', null) // только ответы
      .eq('parent_author_id', user.id); // на мои комментарии

    setCount(count || 0);
  };

  const loadList = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('comments')
      .select('id, content, created_at, source_type, source_id')
      .eq('is_read', false)
      .not('parent_id', 'is', null)
      .eq('parent_author_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!data) return;

    const enriched = await Promise.all(
      data.map(async (r) => {
        const table = r.source_type === 'blog' ? 'blog_posts' : 'gallery';
        const { data: src } = await supabase
          .from(table)
          .select('title, slug')
          .eq(r.source_type === 'blog' ? 'slug' : 'id', r.source_id)
          .single();
        return {
          ...r,
          source_title: src?.title || 'Untitled',
          source_url: r.source_type === 'blog' ? `/blog/${src?.slug}` : `/gallery/${r.source_id}`,
        };
      })
    );
    setList(enriched);
  };

  const markRead = async (id: string) => {
    await supabase.from('comments').update({ is_read: true }).eq('id', id);
    setCount((c) => Math.max(0, c - 1));
    setList((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    if (!user) return;
    fetchCount();
    // подписка на новые
    const channel = supabase
      .channel('notif')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: 'is_read=eq.false' },
        () => fetchCount()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, supabase]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {count === 0 ? (
          <DropdownMenuItem disabled>No new replies</DropdownMenuItem>
        ) : (
          <>
            {list.map((n) => (
              <DropdownMenuItem key={n.id} onClick={() => markRead(n.id)}>
                <div className="flex-1 text-sm">{n.content}</div>
                <div className="text-xs text-foreground/60 ml-2">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={() => location.assign('/profile?tab=notifications')} className="text-center">
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}