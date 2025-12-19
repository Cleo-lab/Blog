'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/hooks/use-supabase'
import { Button } from '@/components/ui/button'
import { ArrowDown, Heart, Sparkles, Award } from 'lucide-react'

interface Donor {
  id: string
  nickname: string
  created_at: string
  is_anonymous: boolean
}

export default function DonorList() {
  const supabase = useSupabase() 
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchDonors()
  }, [])

  const fetchDonors = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('donations') 
        .select('id, nickname, created_at, is_anonymous')
        .in('status', ['verified', 'anonymous']) 
        .order('created_at', { ascending: false }) 

      if (error) throw error
      
      const mappedDonors = (data || []).map(item => ({
        id: item.id,
        nickname: item.is_anonymous ? 'Secret Donor' : item.nickname,
        created_at: item.created_at,
        is_anonymous: item.is_anonymous
      }))
      
      setDonors(mappedDonors)
    } catch (e) {
      console.error('Error fetching donors:', e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center py-8 space-y-2 animate-pulse">
      <div className="h-4 w-32 bg-muted rounded"></div>
      <div className="h-20 w-full bg-muted/50 rounded-2xl"></div>
    </div>
  )
  
  const topDonors = donors.slice(0, 5)
  const otherDonors = donors.slice(5)

  return (
    <div className="w-full space-y-4">
      {donors.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-muted rounded-3xl">
          <p className="text-sm text-muted-foreground italic">Be the first to appear here! ✨</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* VIP TOP 5 BOX */}
<div className="relative overflow-hidden p-[1px] rounded-[2rem] bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-400 shadow-inner">
  <div className="bg-black/20 backdrop-blur-md rounded-[1.9rem] p-4 space-y-1">
    {topDonors.map((donor, index) => (
      <div 
        key={donor.id} 
        className="group flex justify-between items-center py-3 px-3 rounded-xl transition-all hover:bg-white/10"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {index === 0 ? (
            <Award className="w-4 h-4 text-yellow-400 animate-bounce shrink-0" />
          ) : (
            <Sparkles className="w-3 h-3 text-rose-300 shrink-0" />
          )}
          
          {/* ИМЯ: делаем его ярко-белым или очень светло-розовым */}
          <span className={`font-bold text-sm truncate drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] ${
            donor.is_anonymous 
              ? 'text-white/70 italic' 
              : 'text-white' // Чистый белый цвет для максимальной видимости
          }`}>
            {donor.nickname}
          </span>
        </div>
        
        {/* ДАТА: светло-розовая, полупрозрачная */}
        <span className="text-[10px] font-medium text-rose-200/60 tabular-nums">
          {new Date(donor.created_at).toLocaleDateString('ru-RU')} 
        </span>
      </div>
    ))}
  </div>
</div>
          
          {/* OTHER DONORS TOGGLE */}
          {otherDonors.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAll(!showAll)} 
                  className="rounded-full bg-muted/30 hover:bg-pink-500/10 text-[11px] font-bold uppercase tracking-widest text-muted-foreground transition-all"
                >
                  {showAll ? 'Close List' : `View All (${donors.length})`}
                  <ArrowDown className={`w-3 h-3 ml-2 transition-transform duration-500 ${showAll ? 'rotate-180 text-pink-500' : ''}`} />
                </Button>
              </div>
              
              {showAll && (
                <div className="grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-top-2 duration-500 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {otherDonors.map((donor) => (
                    <div key={donor.id} className="flex justify-between items-center px-4 py-2 rounded-xl bg-muted/20 border border-border/40 text-xs">
                      <span className={`truncate max-w-[70%] font-medium ${donor.is_anonymous ? 'text-muted-foreground italic' : 'text-foreground/80'}`}>
                        {donor.nickname}
                      </span>
                      <span className="text-[9px] text-muted-foreground/40 italic">
                        {new Date(donor.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}