// @/components/admin/donations-manager.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/hooks/use-supabase'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RotateCcw, Check, X, ShieldCheck, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Donation {
  id: string
  nickname: string | null
  crypto_address: string
  tx_id: string | null
  crypto_ticker: string | null
  status: 'pending' | 'verified' | 'anonymous' | 'rejected'
  is_anonymous: boolean
  created_at: string
  comment: string | null
  verified_amount?: string
  verified_at?: string
  sender_address?: string
  verification_error?: string | null // Добавляем это поле
}

export default function DonationsManager() {
  const supabase = useSupabase()
  const { toast } = useToast()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchDonations = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDonations(data as Donation[])
    } catch (e: any) {
      console.error('Error fetching donations:', e)
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDonations()
  }, [])

  // 🔴 ИСПРАВЛЕННАЯ ФУНКЦИЯ updateStatus
  const updateStatus = async (id: string, newStatus: Donation['status']) => {
    if (!id) {
      toast({ 
        title: 'Error', 
        description: 'Donation ID is missing', 
        variant: 'destructive' 
      })
      return
    }

    setUpdating(id)
    
    try {
      console.log(`Updating donation ${id} to status: ${newStatus}`)
      
      // Подготавливаем данные для обновления
      const updateData: any = { status: newStatus }
      
      // Если статус "rejected", добавляем сообщение об ошибке
      if (newStatus === 'rejected') {
        updateData.verification_error = 'Manually rejected by admin'
      } else if (newStatus === 'verified') {
        // Если верифицируем вручную, сбрасываем ошибку верификации
        updateData.verification_error = null
      }
      
      // Выполняем обновление
      const { data, error } = await supabase
        .from('donations')
        .update(updateData)
        .eq('id', id)
        .select() // Добавляем select для получения обновленных данных

      if (error) {
        console.error('Supabase update error details:', error)
        throw error
      }

      console.log('Update successful, updated data:', data)
      
      // Обновляем локальное состояние
      setDonations(prev => 
        prev.map(d => d.id === id ? { 
          ...d, 
          status: newStatus,
          verification_error: updateData.verification_error
        } : d)
      )
      
      toast({ 
        title: '✅ Success', 
        description: `Status updated to ${newStatus}` 
      })
      
    } catch (e: any) {
      console.error('Error updating status details:', {
        error: e,
        message: e.message,
        code: e.code,
        details: e.details,
        hint: e.hint
      })
      
      toast({ 
        title: '❌ Error', 
        description: e.message || 'Failed to update status', 
        variant: 'destructive' 
      })
    } finally {
      setUpdating(null)
    }
  }

  // 🔴 УПРОЩЕННАЯ ФУНКЦИЯ ДЛЯ УДАЛЕНИЯ
  const deleteDonation = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this donation record? This action cannot be undone.')) {
      return
    }
    
    setDeleting(id)
    try {
      // Используем прямой вызов к Supabase
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Обновляем локальное состояние
      setDonations(prev => prev.filter(d => d.id !== id))
      
      toast({ 
        title: '✅ Deleted', 
        description: 'Donation record has been removed.' 
      })
      
    } catch (e: any) {
      console.error('Error deleting donation:', e)
      toast({ 
        title: '❌ Error', 
        description: e.message || 'Failed to delete donation.', 
        variant: 'destructive' 
      })
    } finally {
      setDeleting(null)
    }
  }

  // 🔴 УЛУЧШЕННАЯ ФУНКЦИЯ ВЕРИФИКАЦИИ
  const verifyTransaction = async (donation: Donation) => {
    if (!donation.tx_id || !donation.crypto_ticker) {
      toast({ 
        title: 'Error', 
        description: 'Missing transaction ID or crypto ticker', 
        variant: 'destructive' 
      })
      return
    }

    // Проверяем валидность TX ID для разных криптовалют
    if (donation.crypto_ticker === 'ETH' && !donation.tx_id.startsWith('0x')) {
      toast({
        title: 'Invalid TX ID',
        description: 'Ethereum transaction hash must start with 0x',
        variant: 'destructive'
      })
      return
    }

    if (donation.crypto_ticker === 'BTC' && donation.tx_id.length < 10) {
      toast({
        title: 'Invalid TX ID',
        description: 'Bitcoin transaction ID appears to be invalid',
        variant: 'destructive'
      })
      return
    }

    console.log('Starting verification for donation:', donation.id)
    setVerifying(donation.id)

    try {
      const response = await fetch('/api/verify-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: donation.id,
          tx_id: donation.tx_id,
          crypto_address: donation.crypto_address,
          crypto_ticker: donation.crypto_ticker,
        }),
      })

      const result = await response.json()
      console.log('Verification API response:', result)
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: Verification failed`)
      }

      if (result.success) {
        toast({
          title: '✅ Verified!',
          description: result.message,
        })
      } else {
        toast({
          title: '❌ Verification Failed',
          description: result.message || 'Transaction could not be verified',
          variant: 'destructive',
        })
      }
      
      // Обновляем список
      await fetchDonations()
      
    } catch (e: any) {
      console.error('Verification error:', e)
      toast({
        title: '🚨 Error',
        description: e.message || 'Failed to connect to verification service',
        variant: 'destructive',
      })
    } finally {
      setVerifying(null)
    }
  }

  const getBadgeVariant = (status: Donation['status']) => {
    switch (status) {
      case 'verified': return 'default'
      case 'pending': return 'outline'
      case 'rejected': return 'destructive'
      case 'anonymous': return 'secondary'
      default: return 'outline'
    }
  }

  // 🔴 ДОБАВИМ ПРОСТОЙ ИНТЕРФЕЙС ДЛЯ ТЕСТИРОВАНИЯ API КЛЮЧЕЙ
  const testApiKeys = async () => {
    try {
      const response = await fetch('/api/check-env')
      const result = await response.json()
      console.log('Environment check:', result)
      toast({
        title: '🔧 Environment Check',
        description: `Etherscan: ${result.env.etherscanApiKey ? '✅' : '❌'}, TronGrid: ${result.env.trongridApiKey ? '✅' : '❌'}`,
      })
    } catch (e) {
      console.error('Environment check failed:', e)
    }
  }

  if (loading) return <div className="text-center py-10">Loading donations...</div>

  return (
    <div className="p-4">
      {/* 🔴 ДОБАВИМ КНОПКУ ДЛЯ ПРОВЕРКИ ОКРУЖЕНИЯ */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Crypto Donations ({donations.length})</h2>
          <Button 
            onClick={testApiKeys} 
            variant="outline" 
            size="sm"
            title="Check API keys configuration"
          >
            🔧 Check API Keys
          </Button>
        </div>
        <Button onClick={fetchDonations} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {donations.length === 0 ? (
        <div className="text-center py-10 text-foreground/60">No donations yet</div>
      ) : (
        <>
          {/* 🔴 ИНФОРМАЦИОННАЯ ПАНЕЛЬ */}
          <div className="mb-4 p-3 bg-muted rounded-lg text-sm">
            <p className="font-semibold">How to use:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><span className="font-medium">🛡️ Auto-Verify</span> (shield icon): Automatically checks transaction on blockchain</li>
              <li><span className="font-medium">✅ Manual Verify</span> (check icon): Manually mark as verified without blockchain check</li>
              <li><span className="font-medium">❌ Reject</span> (X icon): Mark donation as rejected</li>
              <li><span className="font-medium">🗑️ Delete</span> (trash icon): Permanently remove donation record</li>
            </ul>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Nickname</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead>TxID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="text-xs">
                      {new Date(d.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {d.nickname || 'Anonymous'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{d.crypto_ticker || '-'}</Badge>
                    </TableCell>
                    <TableCell 
                      className="text-xs font-mono max-w-[120px] truncate" 
                      title={d.tx_id || 'No transaction ID'}
                    >
                      {d.tx_id ? `${d.tx_id.slice(0, 8)}...${d.tx_id.slice(-6)}` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(d.status)}>
                        {d.status.toUpperCase()}
                      </Badge>
                      {d.verification_error && (
                        <div className="text-xs text-red-500 mt-1 truncate" title={d.verification_error}>
                          {d.verification_error.length > 30 
                            ? `${d.verification_error.substring(0, 30)}...` 
                            : d.verification_error}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {d.verified_amount || '-'}
                    </TableCell>
                    <TableCell 
                      className="text-sm max-w-[150px] truncate" 
                      title={d.comment || ''}
                    >
                      {d.comment ? (
                        d.comment.length > 30 
                          ? `${d.comment.substring(0, 30)}...` 
                          : d.comment
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Кнопка авто-верификации (только для pending с tx_id) */}
                        {d.status === 'pending' && d.tx_id && (
                          <Button 
                            onClick={() => verifyTransaction(d)} 
                            size="sm" 
                            variant="outline"
                            disabled={verifying === d.id}
                            title="Auto-verify on blockchain"
                            className="h-8 w-8 p-0"
                          >
                            {verifying === d.id ? (
                              <RotateCcw className="w-3 h-3 animate-spin" />
                            ) : (
                              <ShieldCheck className="w-3 h-3 text-blue-500" />
                            )}
                          </Button>
                        )}

                        {/* Кнопка ручной верификации (для pending/rejected) */}
                        {d.status !== 'verified' && (
                          <Button 
                            onClick={() => updateStatus(d.id, 'verified')} 
                            size="sm" 
                            variant="outline"
                            disabled={updating === d.id}
                            title="Manually mark as verified"
                            className="h-8 w-8 p-0"
                          >
                            {updating === d.id ? (
                              <RotateCcw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3 text-green-500" />
                            )}
                          </Button>
                        )}

                        {/* Кнопка отклонения (для всех, кроме rejected) */}
                        {d.status !== 'rejected' && (
                          <Button 
                            onClick={() => updateStatus(d.id, 'rejected')} 
                            size="sm" 
                            variant="outline"
                            disabled={updating === d.id}
                            title="Reject donation"
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-3 h-3 text-red-500" />
                          </Button>
                        )}

                        {/* Кнопка удаления */}
                        <Button 
                          onClick={() => deleteDonation(d.id)} 
                          size="sm" 
                          variant="outline"
                          disabled={deleting === d.id}
                          title="Delete record permanently"
                          className="h-8 w-8 p-0"
                        >
                          {deleting === d.id ? (
                            <RotateCcw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}