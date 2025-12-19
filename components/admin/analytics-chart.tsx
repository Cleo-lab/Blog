'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/hooks/use-supabase';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Users } from 'lucide-react';

export default function AnalyticsChart() {
  const supabase = useSupabase();
  const [data, setData] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [uniqueCount, setUniqueCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      // 1. Запрашиваем данные (ВАЖНО: добавили visitor_id в select)
      const { data: views, error } = await supabase
        .from('page_views')
        .select('created_at, visitor_id')
        .gte('created_at', fourteenDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (!error && views) {
        // 2. Считаем УНИКАЛЬНЫХ (фильтруем тех, у кого visitor_id не пустой)
        const uniqueIds = new Set(
          views
            .filter(v => v.visitor_id) // берем только тех, где есть ID
            .map(v => v.visitor_id)
        ).size;
        
        setUniqueCount(uniqueIds);

        // 3. Группируем для графика (просмотры по дням)
        const grouped = views.reduce((acc: any, view) => {
          const date = new Date(view.created_at).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
          });
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(grouped).map(([date, count]) => ({
          date,
          count: count as number,
        }));
        setData(chartData);
      }
      setLoading(false);
    };

    fetchStats();
  }, [supabase]);

  if (loading) return <div className="h-64 flex items-center justify-center text-rose-200/50">Loading pulse...</div>;

  return (
    <div className="w-full p-8 rounded-[2.5rem] bg-[#09090b] border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[100px] rounded-full" />
      
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-500" />
            Activity Pulse
          </h3>
          <p className="text-xs text-muted-foreground font-medium">Daily views for the last 14 days</p>
        </div>
        
        {/* КАРТОЧКА УНИКАЛЬНЫХ ПРЯМО В ГРАФИКЕ */}
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end text-rose-400">
            <Users className="w-4 h-4" />
            <span className="text-2xl font-black text-white">{uniqueCount}</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Unique Guests</p>
        </div>
      </div>

      <div className="h-72 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
              dy={15}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#18181b', 
                border: '1px solid #ffffff10', 
                borderRadius: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#f43f5e" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorCount)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}