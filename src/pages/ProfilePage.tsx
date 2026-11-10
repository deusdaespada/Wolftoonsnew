import { useParams, Link } from 'react-router-dom'
import { User, BookOpen, Heart, Users, Settings, Crown } from 'lucide-react'
import {
  useProfile,
  useIsFollowing,
  useToggleFollow,
  useLibrary,
  useFavorites,
} from '@/features/library/hooks'
import { useAuthStore } from '@/stores/authStore'
import { TitleCard } from '@/components/titles/TitleCard'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { useState } from 'react'

export function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { data: profile, isLoading, error } = useProfile(username ?? '')
  const currentUser = useAuthStore((s) => s.user)
  const { data: following } = useIsFollowing(profile?.id)
  const toggleFollow = useToggleFollow()
  const [tab, setTab] = useState<'library' | 'favorites'>('library')

  const isOwnProfile = currentUser?.id === profile?.id

  // Only fetch lists for the profile being viewed if it's own or we show public library
  // For Stage 4 we show library/favorites only for own profile (privacy)
  const { data: libraryEntries } = useLibrary()
  const { data: favoriteTitles } = useFavorites()

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Usuário não encontrado</h1>
        <p className="mt-2 text-wolf-white/50">Este perfil não existe.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Voltar ao início</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="border-b border-wolf-gray/40 bg-wolf-graphite/50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="relative">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-wolf-ice/20 sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-wolf-gray ring-4 ring-wolf-ice/20 sm:h-28 sm:w-28">
                  <User className="h-10 w-10 text-wolf-white/40" />
                </div>
              )}
              {profile.is_vip && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-amber-500 p-1.5">
                  <Crown className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="font-display text-2xl font-bold sm:text-3xl">
                  {profile.display_name || profile.username}
                </h1>
                {profile.is_vip && (
                  <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-400">
                    VIP
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-wolf-white/50">@{profile.username}</p>

              {profile.bio && (
                <p className="mt-3 max-w-lg text-sm text-wolf-white/70">{profile.bio}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-wolf-white/50 sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  Nível {profile.level}
                </span>
                <span>{profile.xp} XP</span>
                <span>Desde {formatDate(profile.created_at)}</span>
              </div>

              {/* Stats */}
              <div className="mt-5 flex flex-wrap justify-center gap-6 sm:justify-start">
                <Stat label="Biblioteca" value={profile.library_count ?? 0} />
                <Stat label="Favoritos" value={profile.favorites_count ?? 0} />
                <Stat label="Seguidores" value={profile.followers_count ?? 0} />
                <Stat label="Seguindo" value={profile.following_count ?? 0} />
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                {isOwnProfile ? (
                  <Link to="/settings">
                    <Button variant="secondary" size="sm">
                      <Settings className="h-4 w-4" />
                      Editar perfil
                    </Button>
                  </Link>
                ) : currentUser ? (
                  <Button
                    variant={following ? 'secondary' : 'primary'}
                    size="sm"
                    isLoading={toggleFollow.isPending}
                    onClick={() =>
                      toggleFollow.mutate({
                        followingId: profile.id,
                        currentlyFollowing: !!following,
                      })
                    }
                  >
                    <Users className="h-4 w-4" />
                    {following ? 'Seguindo' : 'Seguir'}
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button size="sm">
                      <Users className="h-4 w-4" />
                      Seguir
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content — only for own profile in Stage 4 */}
      {isOwnProfile && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex gap-1 border-b border-wolf-gray/40">
            <button
              onClick={() => setTab('library')}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === 'library'
                  ? 'border-wolf-ice text-wolf-ice'
                  : 'border-transparent text-wolf-white/50 hover:text-wolf-white/80'
              }`}
            >
              <BookOpen className="mr-1.5 inline h-4 w-4" />
              Biblioteca
            </button>
            <button
              onClick={() => setTab('favorites')}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === 'favorites'
                  ? 'border-wolf-ice text-wolf-ice'
                  : 'border-transparent text-wolf-white/50 hover:text-wolf-white/80'
              }`}
            >
              <Heart className="mr-1.5 inline h-4 w-4" />
              Favoritos
            </button>
          </div>

          {tab === 'library' && (
            libraryEntries && libraryEntries.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {libraryEntries.slice(0, 12).map((e) => (
                  <TitleCard key={e.id} title={e.title} className="w-full" />
                ))}
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-wolf-white/40">Biblioteca vazia.</p>
            )
          )}

          {tab === 'favorites' && (
            favoriteTitles && favoriteTitles.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {favoriteTitles.slice(0, 12).map((t) => (
                  <TitleCard key={t.id} title={t} className="w-full" />
                ))}
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-wolf-white/40">Nenhum favorito.</p>
            )
          )}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold text-wolf-white">{value.toLocaleString('pt-BR')}</div>
      <div className="text-xs text-wolf-white/50">{label}</div>
    </div>
  )
}
