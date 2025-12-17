'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/hooks/use-supabase'
import { Button } from '@/components/ui/button'
import { ArrowDown, Heart } from 'lucide-react'

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
        nickname: item.is_anonymous ? 'Secret Donor ✨' : item.nickname,
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

  if (loading) return <div className="text-center text-sm text-foreground/60 py-4">Loading the donor wall...</div>
  
  const topDonors = donors.slice(0, 5)
  const otherDonors = donors.slice(5)

  return (
    <div className="w-full">
      {/* НОВЫЙ МОТИВИРУЮЩИЙ ЗАГОЛОВОК */}
      <h3 className="text-xl font-bold mb-4 text-center leading-snug text-primary">
        The People Who Keep My Blog Alive <Heart className="w-5 h-5 text-rose-500 fill-rose-500 inline-block align-middle"/>
      </h3>
      
      {donors.length === 0 ? (
        <div className="text-center text-sm text-foreground/60 py-6">
          Be the first to appear here!
        </div>
      ) : (
        <div className="space-y-3">
        
          {/* TOP 5 DONORS (Styled Box) */}
          <div className="p-4 bg-gradient-to-r from-pink-500/10 to-background rounded-xl shadow-lg border border-pink-500/20">
              {topDonors.map((donor, index) => (
                  <div key={donor.id} className={`flex justify-between items-center py-2 ${index < topDonors.length - 1 ? 'border-b border-pink-500/20' : ''}`}>
                      <span className={`font-semibold text-foreground truncate max-w-[70%] ${donor.is_anonymous ? 'text-foreground/80 italic' : 'text-primary'}`}>
                          {donor.nickname}
                      </span>
                      <span className="text-sm text-foreground/60">
                          {/* ИЗМЕНЕНИЕ ФОРМАТА ДАТЫ (DD/MM/YYYY) */}
                          {new Date(donor.created_at).toLocaleDateString('ru-RU')} 
                      </span>
                  </div>
              ))}
          </div>
          
          {/* OTHER DONORS (Toggle) */}
          {otherDonors.length > 0 && (
              <>
                  <div className="flex justify-center">
                      <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)} className="text-primary/80 hover:text-primary">
                          {showAll ? 'Hide' : `Show all (${donors.length})`}
                          <ArrowDown className={`w-4 h-4 ml-2 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                      </Button>
                  </div>
                  
                  {showAll && (
                      <div className="p-4 bg-muted/20 rounded-xl space-y-2 max-h-60 overflow-y-auto">
                          {otherDonors.map((donor) => (
                              <div key={donor.id} className="flex justify-between items-center text-sm text-foreground/80">
                                  <span className={`truncate max-w-[70%] ${donor.is_anonymous ? 'text-foreground/60 italic' : ''}`}>{donor.nickname}</span>
                                  <span className="text-xs text-foreground/50">
                                      {/* ИЗМЕНЕНИЕ ФОРМАТА ДАТЫ (DD/MM/YYYY) */}
                                      {new Date(donor.created_at).toLocaleDateString('ru-RU')}
                                  </span>
                              </div>
                          ))}
                      </div>
                  )}
              </>
          )}
        </div>
      )}
    </div>
  )
}