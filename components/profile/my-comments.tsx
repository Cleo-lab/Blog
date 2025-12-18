// components/profile/my-comments.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useSupabase } from '@/hooks/use-supabase';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, ExternalLink, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface MyComment {
  id: string;
  content: string;
  created_at: string;
  source_type: 'blog' | 'gallery';
  source_id: string;
  source_title: string;
  source_slug?: string;
  replies_count: number;
  unread_replies: number;
}

export default function MyComments() {
  const { user } = useAuth();
  const supabase = useSupabase();
  const { toast } = useToast();
  const [comments, setComments] = useState<MyComment[]>([]);
  const [loading, setLoading] = useState(true);

  // загружаем комментарии текущего пользователя
  useEffect(() => {
    if (!user) return;
    loadComments();
  }, [user]);

  const loadComments = async () => {
    setLoading(true);
    try {
      // 1. все комменты пользователя
      const { data: my } = await supabase
        .from('comments')
        .select('id, content, created_at, source_type, source_id, parent_id')
        .eq('author_id', user.id)
        .is('parent_id', null) // только топ-уровень
        .order('created_at', { ascending: false });

      if (!my) return setComments([]);

      // 2. для каждого коммента достаём заголовок источника + считаем ответы
      const enriched: MyComment[] = await Promise.all(
        my.map(async (c) => {
          const table = c.source_type === 'blog' ? 'blog_posts' : 'gallery';
          const { data: src } = await supabase
            .from(table)
            .select('title, slug')
            .eq(c.source_type === 'blog' ? 'slug' : 'id', c.source_id)
            .single();

          // кол-во ответов и непрочитанных
          const { count: total } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('parent_id', c.id);

          const { count: unread } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('parent_id', c.id)
            .eq('is_read', false);

          return {
            id: c.id,
            content: c.content,
            created_at: c.created_at,
            source_type: c.source_type,
            source_id: c.source_id,
            source_title: src?.title || 'Untitled',
            source_slug: src?.slug,
            replies_count: total || 0,
            unread_replies: unread || 0,
          };
        })
      );

      setComments(enriched);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // переход к месту коммента
  const goToSource = (c: MyComment) =>
    c.source_type === 'blog' ? `/blog/${c.source_slug}` : `/gallery/${c.source_id}`;

  // пометить ответы прочитанными
  const markRepliesRead = async (commentId: string) => {
    await supabase.from('comments').update({ is_read: true }).eq('parent_id', commentId);
    setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, unread_replies: 0 } : c)));
  };

  if (loading) return <p className="p-4 text-foreground/60">Loading comments...</p>;

  return (
    <section className="min-h-[calc(100vh-4rem)] py-12 px-4 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">My Comments</h1>
        <p className="text-foreground/60 mb-6">Click a comment to jump to the source</p>

        {comments.length ? (
          <div className="space-y-4">
            {comments.map((c) => (
              <Card
                key={c.id}
                className={`relative border-border/50 bg-card p-4 transition ${
                  c.unread_replies ? 'border-l-4 border-l-red-500' : ''
                }`}
              >
                {/* красный кружок если есть непрочитанные ответы */}
                {c.unread_replies > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-primary/60 uppercase tracking-wide mb-1">
                      {c.source_type === 'blog' ? 'Blog' : 'Gallery'} • {new Date(c.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed">{c.content}</p>

                    {/* счётчик ответов + кнопка «прочитать» */}
                    {c.replies_count > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-foreground/60">{c.replies_count} replies</span>
                        {c.unread_replies > 0 && (
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => markRepliesRead(c.id)}
                            className="text-xs h-6 px-2"
                          >
                            Mark read ({c.unread_replies})
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <Link
                    href={goToSource(c)}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                    onClick={() => c.unread_replies && markRepliesRead(c.id)}
                  >
                    <span className="hidden sm:inline">{c.source_title}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/50 mb-4">You haven't left any comments yet.</p>
            <Button onClick={() => location.assign('/blog')} className="bg-primary hover:bg-primary/90">
              Explore Posts
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}