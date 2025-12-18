// components/fav-button.tsx
'use client';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FavButton({ id, title, type }: { id: string; title: string; type: 'blog' | 'gallery' }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fav = JSON.parse(localStorage.getItem('fav') || '[]');
    setIsFav(fav.some((i: any) => i.id === id));
  }, [id]);

  const toggle = () => {
    const fav: { id: string; title: string; type: 'blog' | 'gallery' }[] = JSON.parse(localStorage.getItem('fav') || '[]');
    if (isFav) {
      localStorage.setItem('fav', JSON.stringify(fav.filter((i) => i.id !== id)));
      setIsFav(false);
    } else {
      localStorage.setItem('fav', JSON.stringify([...fav, { id, title, type }]));
      setIsFav(true);
    }
  };

  return (
    <Button size="sm" variant={isFav ? 'default' : 'outline'} onClick={toggle} className="gap-2">
      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
      {isFav ? 'Favourited' : 'Add to favourites'}
    </Button>
  );
}