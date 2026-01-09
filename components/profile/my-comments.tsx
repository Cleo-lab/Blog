'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useSupabase } from '@/hooks/use-supabase';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, MessageSquare, Inbox } from 'lucide-react';
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

interface CommentData {
  id: string;
  content: string;
  created_at: string;
  source_type: string;
  source_id: string;
  parent_id: string | null;
}

export default function MyComments({ setCurrentSection }: { setCurrentSection?: (s: string) => void }) {
  const { user } = useAuth();
  const supabase = useSupabase();
  const { toast } = useToast();
  const [comments, setComments] = useState<MyComment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComments = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Получаем все комментарии пользователя
      const { data: my, error: fetchError } = await supabase
        .from('comments')
        .select('id, content, created_at, source_type, source_id, parent_id')
        .eq('author_id', user.id)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      if (!my || my.length === 0) {
        setComments([]);
        return;
      }

      // 2. Обогащаем данные (заголовки и счетчики)
      // В идеале это лучше делать через RPC функцию в Postgres, но для начала исправим текущий метод
      const enriched: MyComment[] = await Promise.all(
        my.map(async (c: CommentData) => {
          const table = c.source_type === 'blog' ? 'blog_posts' : 'gallery';
          
          // Получаем заголовок поста/галереи
          const { data: src } = await supabase
            .from(table)
            .select('title, slug')
            .eq(c.source_type === 'blog' ? 'slug' : 'id', c.source_id)
            .single();

          // Считаем общее кол-во ответов
          const { count: total } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('parent_id', c.id);

          // Считаем непрочитанные ответы
          const { count: unread } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('parent_id', c.id)
            .eq('is_read', false);

          return {
            id: c.id,
            content: c.content,
            created_at: c.created_at,
            source_type: c.source_type as 'blog' | 'gallery',
            source_id: c.source_id,
            source_title: src?.title || 'Untitled Story',
            source_slug: src?.slug,
            replies_count: total || 0,
            unread_replies: unread || 0,
          };
        })
      );

      setComments(enriched);
    } catch (e: any) {
      console.error('Comments loading error:', e);
      toast({ title: 'Error', description: 'Failed to load comments', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, supabase, toast]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const markRepliesRead = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_read: true })
        .eq('parent_id', commentId);

      if (error) throw error;

      setComments((prev) => 
        prev.map((c) => (c.id === commentId ? { ...c, unread_replies: 0 } : c))
      );
      toast({ title: 'Success', description: 'Replies marked as read' });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const goToSource = (c: MyComment) =>
    c.source_type === 'blog' ? `/blog/${c.source_slug}` : `/gallery/${c.source_id}`;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">Fetching your history...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            My Comments
          </h1>
          <p className="text-muted-foreground italic">Track your discussions and replies</p>
        </header>

        {comments.length ? (
          <div className="grid gap-4">
            {comments.map((c) => (
              <Card
                key={c.id}
                className={`group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all hover:shadow-lg hover:border-pink-500/30 ${
                  c.unread_replies > 0 ? 'border-l-4 border-l-pink-500 ring-1 ring-pink-500/10' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        c.source_type === 'blog' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                      }`}>
                        {c.source_type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-foreground/90 font-medium leading-relaxed mb-4">
                      "{c.content}"
                    </p>

                    <div className="flex items-center gap-4">
                      {c.replies_count > 0 && (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-pink-500/70" />
                          <span className="text-sm font-semibold text-foreground/70">{c.replies_count} replies</span>
                        </div>
                      )}
                      {c.unread_replies > 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => markRepliesRead(c.id)}
                          className="h-7 text-xs bg-pink-500 text-white hover:bg-pink-600 border-none"
                        >
                          Mark {c.unread_replies} new read
                        </Button>
                      )}
                    </div>
                  </div>

                  <Link
                    href={goToSource(c)}
                    className="flex items-center gap-2 text-sm font-bold text-pink-500 hover:text-pink-600 transition-colors bg-pink-500/5 px-4 py-2 rounded-xl border border-pink-500/10 group-hover:border-pink-500/30"
                    onClick={() => c.unread_replies > 0 && markRepliesRead(c.id)}
                  >
                    <span className="max-w-[150px] truncate">{c.source_title}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/10 rounded-[3rem] border border-dashed border-border/50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/20 mb-4">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Silence is golden... but sharing is better!</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              You haven't participated in any discussions yet. Check out the latest stories.
            </p>
            <Button 
              onClick={() => setCurrentSection ? setCurrentSection('home') : window.location.assign('/')} 
              className="bg-pink-600 hover:bg-pink-500 text-white px-8 rounded-full font-bold"
            >
              Explore Blog
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}