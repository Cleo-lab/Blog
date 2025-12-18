// components/profile/my-achievements.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Hammer, Award } from 'lucide-react';

export default function MyAchievements() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Achievements</h3>
      </div>
      
      <Card className="p-10 border-2 border-dashed bg-muted/30 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm mb-4">
          <Hammer className="w-6 h-6 text-primary animate-bounce" />
        </div>
        
        <h4 className="text-base font-medium mb-2 text-foreground">
          Section Under Development
        </h4>
        
        <p className="text-sm text-muted-foreground max-w-[300px]">
          We are currently building the badge and reward system. 
          Your achievements and milestones will appear here very soon!
        </p>
        
        {/* Decorative placeholders */}
        <div className="grid grid-cols-4 gap-3 mt-8 opacity-20">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="w-10 h-10 rounded-full bg-foreground/20 flex items-center justify-center"
            >
              <Award className="w-5 h-5" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}