// components/blog/blog-teaser.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Lock, Sparkles, UserPlus } from 'lucide-react';

interface BlogTeaserProps {
  onSignIn: () => void;
}

export default function BlogTeaser({ onSignIn }: BlogTeaserProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 p-8 text-center shadow-lg">
      {/* Декоративный размытый фон для эффекта "скрытого контента" */}
      <div className="absolute inset-0 -z-10 opacity-10 select-none pointer-events-none">
        <div className="p-4 space-y-4 filter blur-sm">
          <div className="h-4 w-3/4 bg-foreground rounded" />
          <div className="h-4 w-full bg-foreground rounded" />
          <div className="h-4 w-5/6 bg-foreground rounded" />
          <div className="h-4 w-1/2 bg-foreground rounded" />
        </div>
      </div>

      <div className="max-w-md mx-auto py-10 space-y-6">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-2">
          <Lock className="w-8 h-8 text-primary animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">
            Want to see more? ✨
          </h3>
          <p className="text-muted-foreground">
            Some thoughts are too personal for the public eye. Join our community to unlock exclusive blog posts and secret gallery updates.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            onClick={onSignIn} 
            size="lg" 
            className="w-full sm:w-auto font-bold shadow-md hover:shadow-primary/20 transition-all"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Sign Up Now
          </Button>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            <Sparkles className="w-3 h-3 text-yellow-500" />
            <span>It's Free</span>
          </div>
        </div>
      </div>

      {/* Маленькая плашка снизу */}
      <div className="mt-8 pt-6 border-t border-border/50 text-xs text-muted-foreground italic">
        "Becoming a part of this world is just one click away..."
      </div>
    </div>
  );
}