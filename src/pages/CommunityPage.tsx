import { Link } from 'react-router-dom'
import { MessageSquare, User, Crown } from 'lucide-react'
import { useRecentDiscussions } from '@/features/community/hooks'
import { Spinner } from '@/components/ui/Spinner'
import { formatRelativeTime } from '@/lib/utils'

export function CommunityPage() {
  const { data: discussions, isLoading, error } = useRecentDiscussions(30)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Comunidade</h1>
        <p className="mt-1 text-sm text-wolf-white/50">
          Discussões recentes sobre obras e capítulos
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 py-12 text-center text-red-300">
          Erro ao carregar discussões.
        </div>
      ) : !discussions || discussions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquare className="h-12 w-12 text-wolf-white/20" />
          <p className="mt-4 text-wolf-white/50">Nenhuma discussão ainda.</p>
          <p className="mt-1 text-xs text-wolf-white/30">
            Comente em uma obra para iniciar uma conversa.
          </p>
          <Link to="/catalog" className="mt-4 text-sm font-medium text-wolf-ice hover:underline">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {discussions.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-wolf-gray/30 bg-wolf-graphite/40 p-4 transition-all hover:border-wolf-gray/50"
            >
              <div className="flex items-start gap-3">
                <Link to={`/profile/${c.author.username}`} className="shrink-0">
                  {c.author.avatar_url ? (
                    <img
                      src={c.author.avatar_url}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-wolf-gray">
                      <User className="h-4 w-4 text-wolf-white/40" />
                    </div>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/profile/${c.author.username}`}
                      className="text-sm font-semibold text-wolf-white hover:text-wolf-ice"
                    >
                      {c.author.display_name || c.author.username}
                    </Link>
                    {c.author.is_vip && <Crown className="h-3.5 w-3.5 text-amber-400" />}
                    <span className="text-xs text-wolf-white/40">
                      {formatRelativeTime(c.created_at)}
                    </span>
                    <span className="rounded bg-wolf-gray/50 px-1.5 py-0.5 text-[10px] text-wolf-white/50">
                      {c.target_type === 'title' ? 'obra' : 'capítulo'}
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm text-wolf-white/70 line-clamp-3 whitespace-pre-wrap">
                    {c.is_spoiler ? '⚠ Comentário com spoiler' : c.content}
                  </p>

                  <div className="mt-2 flex items-center gap-3 text-xs text-wolf-white/40">
                    {c.likes_count > 0 && <span>♥ {c.likes_count}</span>}
                    {(c as any).title_name && (
                      <span className="text-wolf-white/50">{(c as any).title_name}</span>
                    )}
                    {(c as any).title_slug && (
                      <Link
                        to={`/title/${(c as any).title_slug}`}
                        className="text-wolf-ice hover:underline"
                      >
                        Ver obra →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
