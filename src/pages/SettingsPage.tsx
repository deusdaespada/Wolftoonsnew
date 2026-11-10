import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useUpdateProfile } from '@/features/library/hooks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { User, Save, LogOut } from 'lucide-react'

export function SettingsPage() {
  const { user, profile, isLoading: authLoading, signOut, refreshProfile } = useAuthStore()
  const updateProfile = useUpdateProfile()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? '')
      setUsername(profile.username ?? '')
      setBio(profile.bio ?? '')
      setAvatarUrl(profile.avatar_url ?? '')
    }
  }, [profile])

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user || !profile) {
    navigate('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      setMessage({ type: 'error', text: 'Username deve ter 3-30 caracteres (letras, números e _)' })
      return
    }

    try {
      await updateProfile.mutateAsync({
        display_name: displayName.trim() || null,
        username: username.trim().toLowerCase(),
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
      await refreshProfile()
    } catch (err: any) {
      const msg =
        err?.message?.includes('duplicate') || err?.code === '23505'
          ? 'Este username já está em uso'
          : err?.message || 'Erro ao atualizar perfil'
      setMessage({ type: 'error', text: msg })
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="mt-1 text-sm text-wolf-white/50">Gerencie seu perfil e preferências</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar preview */}
        <div className="flex items-center gap-5">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-20 w-20 rounded-full object-cover ring-2 ring-wolf-ice/30"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-wolf-gray ring-2 ring-wolf-ice/30">
              <User className="h-8 w-8 text-wolf-white/40" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-wolf-white">
              {displayName || username}
            </p>
            <p className="text-xs text-wolf-white/50">@{username}</p>
          </div>
        </div>

        {message && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-red-500/30 bg-red-500/10 text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-4 rounded-2xl border border-wolf-gray/40 bg-wolf-graphite p-6">
          <h2 className="font-semibold text-wolf-white">Informações do perfil</h2>

          <Input
            id="displayName"
            label="Nome de exibição"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Seu nome"
            maxLength={50}
          />

          <Input
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="seu_username"
            maxLength={30}
            required
          />

          <div className="space-y-1.5">
            <label htmlFor="bio" className="block text-sm font-medium text-wolf-white/80">
              Biografia
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte um pouco sobre você..."
              maxLength={300}
              rows={3}
              className="w-full rounded-lg border border-wolf-gray/60 bg-wolf-black px-4 py-2.5 text-sm text-wolf-white placeholder:text-wolf-white/40 focus:border-wolf-ice focus:outline-none focus:ring-2 focus:ring-wolf-ice/20 transition-all resize-none"
            />
            <p className="text-xs text-wolf-white/40">{bio.length}/300</p>
          </div>

          <Input
            id="avatarUrl"
            label="URL do avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            type="url"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" isLoading={updateProfile.isPending}>
            <Save className="h-4 w-4" />
            Salvar alterações
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate(`/profile/${profile.username}`)}>
            Ver perfil
          </Button>
        </div>
      </form>

      {/* Account actions */}
      <div className="mt-12 rounded-2xl border border-wolf-gray/40 bg-wolf-graphite p-6">
        <h2 className="font-semibold text-wolf-white">Conta</h2>
        <p className="mt-1 text-sm text-wolf-white/50">
          E-mail: <span className="text-wolf-white/70">{user.email}</span>
        </p>
        <div className="mt-4">
          <Button variant="danger" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sair da conta
          </Button>
        </div>
      </div>
    </div>
  )
}
