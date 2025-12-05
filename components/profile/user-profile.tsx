'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload } from 'lucide-react'
import { useSupabase } from '@/hooks/use-supabase'
import { useToast } from '@/hooks/use-toast'

interface UserProfileProps {
  setCurrentSection?: (section: string) => void
  onProfileUpdate?: () => void
}

export default function UserProfile({ setCurrentSection, onProfileUpdate }: UserProfileProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const supabase = useSupabase()  
      const {
        data: { user }
      } = await supabase.auth.getUser()

      console.log('Current auth user:', user)

      if (!user) {
        throw new Error('Not authenticated')
      }

      setUserId(user.id)
      setEmail(user.email || '')

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single()

      console.log('Profile data:', { profile, error })

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (profile) {
        setUsername(profile.username || '')
        setAvatarUrl(profile.avatar_url || '')
      } else {
        // If profile doesn't exist, create it
        const { error: insertError } = await supabase.from('profiles').insert([
          {
            id: user.id,
            username: user.email?.split('@')[0] || 'user',
            avatar_url: null,
            is_admin: false
          }
        ])

        if (insertError) {
          console.warn('Could not create profile:', insertError)
        }
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      toast({
        title: 'Error',
        description: error?.message || 'Failed to load profile',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please upload an image file',
        variant: 'destructive'
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size must be less than 5MB',
        variant: 'destructive'
      })
      return
    }

    setUploading(true)
    try {
      // Delete all old avatars in user's folder
      if (userId) {
        try {
          const supabase = useSupabase()
          const { data: files } = await supabase.storage
            .from('avatars')
            .list(userId)
          
          if (files && files.length > 0) {
            const filePaths = files.map((file) => `${userId}/${file.name}`)
            await supabase.storage.from('avatars').remove(filePaths)
            console.log('Old avatars deleted:', filePaths)
          }
        } catch (error) {
          console.warn('Could not delete old avatars:', error)
        }
      }

      const fileName = `${userId}/${Date.now()}.${file.name.split('.').pop()}`
      const supabase = useSupabase()

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)

      setAvatarUrl(data.publicUrl)

      toast({
        title: 'Success',
        description: 'Avatar uploaded successfully'
      })
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      toast({
        title: 'Error',
        description: error?.message || 'Failed to upload avatar',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!userId) return

    if (!username.trim()) {
      toast({
        title: 'Error',
        description: 'Username cannot be empty',
        variant: 'destructive'
      })
      return
    }

    setSaving(true)
    try {
      const supabase = useSupabase()
      const { error } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          avatar_url: avatarUrl
        })
        .eq('id', userId)

      if (error) throw error

      // Trigger parent component to refresh avatar
      onProfileUpdate?.()

      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      })
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast({
        title: 'Error',
        description: error?.message || 'Failed to save profile',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] py-12 px-4 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-foreground/60 mb-8">Manage your account settings</p>

          {loading ? (
            <p className="text-foreground/60">Loading profile...</p>
          ) : (
            <div className="space-y-8">
              {/* Avatar Section */}
              <div>
                <label className="block text-sm font-medium mb-4 text-foreground">Avatar</label>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary p-1 flex-shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-2xl">
                        👤
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="avatar-input"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={uploading}
                      className="hidden"
                    />
                    <Button
                      onClick={() => document.getElementById('avatar-input')?.click()}
                      variant="outline"
                      className="border-border/50"
                      disabled={uploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Change Avatar'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Username</label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background border-border/50"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted border-border/50 cursor-not-allowed"
                />
                <p className="text-xs text-foreground/50 mt-2">Email cannot be changed</p>
              </div>

              {/* Save Button */}
              <div className="flex gap-3 pt-6 border-t border-border/50">
                <Button
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => setCurrentSection?.('home')}
                  variant="outline"
                  className="border-border/50"
                  disabled={saving}
                >
                  Back to Blog
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}



