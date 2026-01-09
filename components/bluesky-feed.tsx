'use client';

import { useEffect, useState } from 'react';
import { BskyAgent } from '@atproto/api';

export default function BlueskyFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const agent = new BskyAgent({ service: 'https://public.api.bsky.app' });
        const response = await agent.getAuthorFeed({ actor: 'yurieblog.bsky.social', limit: 10 });
        setPosts(response.data.feed);
      } catch (e) {
        console.error("Failed to load bsky posts", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-40 gap-3">
      <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-bold text-pink-400 animate-pulse">Fetching magic...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* КНОПКА FOLLOW — Градиент в стиле твоего блога */}
      <div className="mb-5 px-1">
        <a 
          href="https://bsky.app/profile/yurieblog.bsky.social" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-md shadow-pink-500/20 hover:shadow-pink-500/40 transition-all hover:scale-[1.02] active:scale-95 group"
        >
          <span>Follow @yurieblog</span>
          <span className="bg-white/20 rounded-full p-1 text-[10px] group-hover:-rotate-12 transition-transform">🦋</span>
        </a>
      </div>

      {/* ЛЕНТА ПОСТОВ */}
      <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar px-1 pb-4">
        {posts.map((item, i) => {
          const post = item.post;
          const postHref = `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`;

          return (
            <div
  key={i}
  className="group relative p-5 rounded-2xl border-2 transition-all duration-300
             bg-white dark:bg-zinc-900/90
             border-pink-300 dark:border-pink-600
             hover:border-pink-400 dark:hover:border-pink-500
             shadow-[0_4px_20px_-10px_rgba(236,72,153,0.25)]
             hover:shadow-[0_8px_25px_-5px_rgba(236,72,153,0.4)]"
>
              
              {/* Верхняя часть: Дата и иконка */}
              <div className="flex items-center justify-between mb-3 border-b border-pink-100 dark:border-pink-900/30 pb-2">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded-md">
                      Post
                    </span>
                 </div>
                 <span className="text-[10px] font-medium text-purple-400">
                    {new Date(post.indexedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                 </span>
              </div>

              {/* Текст поста */}
              <p className="leading-relaxed text-sm text-slate-700 dark:text-slate-200
                whitespace-pre-wrap break-words overflow-hidden
                font-medium">
    {post.record.text}
  </p>

              {/* Картинки */}
              {post.embed?.images && (
                <div className="grid grid-cols-1 gap-2 rounded-xl overflow-hidden mb-4 border border-pink-100 dark:border-pink-900/30">
                  {post.embed.images.map((img: any, idx: number) => (
                    <img 
                      key={idx} 
                      src={img.thumb} 
                      alt={img.alt || "Bluesky image"} 
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                    />
                  ))}
                </div>
              )}

              {/* Футер карточки: Лайки и кнопка */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-purple-500 transition-colors">
                    <span>💬</span>
                    <span className="font-medium">{post.replyCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-pink-500 transition-colors">
                    <span>❤️</span>
                    <span className="font-medium">{post.likeCount || 0}</span>
                  </div>
                </div>

                <a 
                  href={postHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] flex items-center gap-1 bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-500 hover:text-white text-pink-600 px-3 py-1.5 rounded-full transition-all font-bold"
                >
                  Read more 
                  <span className="text-[8px]">↗</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}