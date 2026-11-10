import { useParams, Link } from 'react-router-dom'
import {
  Star,
  BookOpen,
  Eye,
  Heart,
  Calendar,
  User,
  ChevronRight,
  List,
} from 'lucide-react'
import { useTitle } from '@/features/titles/hooks'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { LibraryStatusSelector } from '@/components/library/LibraryStatusSelector'
import { FavoriteButton } from '@/components/library/FavoriteButton'
import { CommentSection } from '@/components/comments/CommentSection'
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/types/title'
import { formatDate, formatRelativeTime, cn } from '@/lib/utils'
import { useState } from 'react'

export function TitleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: title, isLoading, error } = useTitle(slug ?? '')
  const [chaptersOrder, setChaptersOrder] = useState<'desc' | 'asc'>('desc')

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !title) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-wolf-white">Obra não encontrada</h1>
        <p className="mt-2 text-wolf-white/50">
          A obra que você procura não existe ou ainda não foi publicada.
        </p>
        <Link to="/catalog" className="mt-6 inline-block">
          <Button>Voltar ao Catálogo</Button>
        </Link>
      </div>
    )
  }

  const sortedChapters = [...(title.chapters ?? [])].sort((a, b) =>
    chaptersOrder === 'desc' ? b.number - a.number : a.number - b.number
  )

  const firstChapter = [...(title.chapters ?? [])].sort((a, b) => a.number - b.number)[0]
  const lastChapter = [...(title.chapters ?? [])].sort((a, b) => b.number - a.number)[0]

  return (
    <div className="animate-fade-in">
      {/* Banner / Hero */}
      <div className="relative border-b border-wolf-gray/40">
        <div className="absolute inset-0 overflow-hidden">
          {title.cover_url || title.banner_url ? (
            <img
              src={title.banner_url || title.cover_url || ''}
              alt=""
              className="h-full w-full object-cover scale-110 blur-3xl opacity-25"
            />
          ) : (
            <div className="h-full w-full bg-wolf-deep" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-wolf-black via-wolf-black/70 to-wolf-black/40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            {/* Cover */}
            <div className="mx-auto shrink-0 md:mx-0">
              <div className="w-[180px] sm:w-[220px] aspect-[2/3] overflow-hidden rounded-xl border border-wolf-gray/40 shadow-wolf-lg">
                {title.cover_url ? (
                  <img
                    src={title.cover_url}
                    alt={title.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-wolf-graphite">
                    <BookOpen className="h-16 w-16 text-wolf-white/20" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-5 text-center md:text-left">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="rounded-md bg-wolf-ice/20 px-2.5 py-1 text-xs font-semibold text-wolf-ice">
                  {CATEGORY_LABELS[title.category] ?? title.category}
                </span>
                <span
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-semibold',
                    STATUS_COLORS[title.status]
                  )}
                >
                  {STATUS_LABELS[title.status] ?? title.status}
                </span>
              </div>

              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {title.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-wolf-white/60">
                {title.author && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {title.author}
                  </span>
                )}
                {title.rating > 0 && (
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <Star className="h-4 w-4 fill-amber-300" />
                    {title.rating.toFixed(1)}
                    <span className="text-wolf-white/40">({title.rating_count})</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {title.views.toLocaleString('pt-BR')} views
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4" />
                  {title.favorites_count.toLocaleString('pt-BR')}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {title.chapters_count} capítulos
                </span>
              </div>

              {/* Genres */}
              {title.genres.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {title.genres.map((g) => (
                    <Link
                      key={g.id}
                      to={`/catalog?genres=${g.slug}`}
                      className="rounded-full border border-wolf-gray/50 bg-wolf-gray/30 px-3 py-1 text-xs text-wolf-white/70 hover:border-wolf-ice/40 hover:text-wolf-ice transition-colors"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Description */}
              {title.description && (
                <p className="max-w-2xl text-sm leading-relaxed text-wolf-white/70 line-clamp-4 md:line-clamp-none">
                  {title.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                {firstChapter && (
                  <Link to={`/read/${title.slug}/${firstChapter.number}`}>
                    <Button size="lg">
                      Começar a ler
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                {lastChapter && lastChapter.number !== firstChapter?.number && (
                  <Link to={`/read/${title.slug}/${lastChapter.number}`}>
                    <Button variant="secondary" size="lg">
                      Último capítulo
                    </Button>
                  </Link>
                )}
                <LibraryStatusSelector titleId={title.id} />
                <FavoriteButton titleId={title.id} />
              </div>

              {title.last_chapter_at && (
                <p className="text-xs text-wolf-white/40 flex items-center justify-center md:justify-start gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Atualizado {formatRelativeTime(title.last_chapter_at)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chapters list */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <List className="h-5 w-5 text-wolf-ice" />
            Capítulos
            <span className="text-sm font-normal text-wolf-white/40">
              ({title.chapters_count})
            </span>
          </h2>
          <button
            onClick={() => setChaptersOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
            className="text-sm text-wolf-ice hover:underline"
          >
            {chaptersOrder === 'desc' ? 'Mais recentes' : 'Mais antigos'}
          </button>
        </div>

        {sortedChapters.length === 0 ? (
          <div className="rounded-xl border border-wolf-gray/30 bg-wolf-graphite/30 py-16 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-wolf-white/20" />
            <p className="mt-3 text-sm text-wolf-white/40">Nenhum capítulo publicado ainda.</p>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {sortedChapters.map((chapter) => (
              <Link
                key={chapter.id}
                to={`/read/${title.slug}/${chapter.number}`}
                className="group flex items-center justify-between rounded-xl border border-wolf-gray/30 bg-wolf-graphite/40 px-4 py-3 transition-all hover:border-wolf-ice/40 hover:bg-wolf-graphite"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-wolf-white group-hover:text-wolf-ice transition-colors truncate">
                    Capítulo {chapter.number}
                    {chapter.title && (
                      <span className="text-wolf-white/50"> — {chapter.title}</span>
                    )}
                  </p>
                  <div className="mt-0.5 flex items-center gap-3 text-[11px] text-wolf-white/40">
                    {chapter.published_at && (
                      <span>{formatDate(chapter.published_at)}</span>
                    )}
                    {chapter.pages_count > 0 && (
                      <span>{chapter.pages_count} págs</span>
                    )}
                    {chapter.views > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Eye className="h-3 w-3" />
                        {chapter.views}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-wolf-white/30 group-hover:text-wolf-ice transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="border-t border-wolf-gray/40 pt-10">
          <CommentSection targetType="title" targetId={title.id} />
        </div>
      </div>
    </div>
  )
}
