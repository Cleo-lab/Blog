// components/profile/my-favourites.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ExternalLink } from 'lucide-react';

interface FavItem {
  id: string;
  title: string;
  type: 'blog' | 'gallery';
}

export default function MyFavourites() {
  const [fav, setFav] = useState<FavItem[]>([]);

  useEffect(() => {
    // загружаем из LocalStorage
    const raw = JSON.parse(localStorage.getItem('fav') || '[]');
    setFav(raw);
  }, []);

  const remove = (id: string) => {
    const updated = fav.filter((i) => i.id !== id);
    localStorage.setItem('fav', JSON.stringify(updated));
    setFav(updated);
  };

  if (!fav.length)
    return (
      <div className="text-center py-6 text-foreground/60">
        <Heart className="w-8 h-8 mx-auto mb-2" />
        <p>No favourites yet. Star any post or image!</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Heart className="w-5 h-5" /> My Favourites ({fav.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fav.map((item) => (
          <Card key={item.id} className="p-3 flex items-center justify-between">
            <CardContent className="p-0 flex items-center gap-3">
              <Heart className="w-4 h-4 text-pink-500" />
              <div>
                <Link
                  href={item.type === 'blog' ? `/blog/${item.id}` : `/gallery/${item.id}`}
                  className="text-sm font-medium hover:underline"
                >
                  {item.title}
                </Link>
                <p className="text-xs text-foreground/60">{item.type}</p>
              </div>
            </CardContent>
            <button
              onClick={() => remove(item.id)}
              className="text-foreground/40 hover:text-destructive"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}