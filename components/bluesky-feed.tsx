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

  if (loading) return <div className="text-center p-10 animate-pulse text-sm opacity-50 text-primary">Loading magic updates... ✨</div>;

  return (
    <div className="flex flex-col h-full">
      {/* КНОПКА FOLLOW НАД ЛЕНТОЙ */}
      <div className="mb-6">
        <a 
          href="https://bsky.app/profile/yurieblog.bsky.social" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border border-blue-500/30 hover:border-blue-500/60 text-blue-400 rounded-xl font-bold text-xs transition-all hover:scale-[1.01] active:scale-95 group"
        >
          <span>Follow @yurieblog</span>
          <span className="transition-transform group-hover:rotate-12">🦋</span>
        </a>
      </div>

      {/* ЛЕНТА ПОСТОВ */}
      <div className="space-y-6 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar px-1">
        {posts.map((item, i) => {
          const post = item.post;
          const postHref = `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`;

          return (
            <div key={i} className="group p-4 rounded-2xl bg-card border border-border/40 hover:border-primary/30 transition-all shadow-sm">
              
              {/* Текст поста */}
              <p className="leading-relaxed text-sm text-foreground/90 whitespace-pre-wrap mb-3">
                {post.record.text}
              </p>

              {/* Картинки */}
              {post.embed?.images && (
                <div className="grid grid-cols-1 gap-2 rounded-xl overflow-hidden mb-3 border border-border/20">
                  {post.embed.images.map((img: any, idx: number) => (
                    <img 
                      key={idx} 
                      src={img.thumb} 
                      alt={img.alt || "Bluesky image"} 
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ))}
                </div>
              )}

              {/* Блок взаимодействия */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/20">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1 text-[10px] opacity-60">
                    <span>💬</span>
                    <span>{post.replyCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] opacity-60">
                    <span>🔁</span>
                    <span>{post.repostCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-pink-500/80">
                    <span>❤️</span>
                    <span>{post.likeCount || 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] opacity-40 font-mono">
                    {new Date(post.indexedAt).toLocaleDateString()}
                  </span>
                  <a 
                    href={postHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-full transition-colors font-bold"
                  >
                    Reply
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}