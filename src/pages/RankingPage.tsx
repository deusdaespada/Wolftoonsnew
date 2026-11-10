import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Star, Eye, Heart, BookOpen } from 'lucide-react'
import { useRanking } from '@/features/ranking/hooks'
import { Spinner } from '@/components/ui/Spinner'
import {
  RANKING_TYPE_LABELS,
  RANKING_PERIOD_LABELS,
  type RankingType,
  type RankingPeriod,
} from '@/types/ranking'
import { CATEGORY_LABELS, STATUS_LABELS } from '@/types/title'
import { cn } from '@/lib/utils'

const TYPES: RankingType[] = [
  'popular',
  'most_read',
  'most_favorited',
  'top_rated',
  'most_commented',
  'recently_updated',
  'newest',
  'completed',
]

const PERIODS: RankingPeriod[] = ['daily', 'weekly', 'monthly', 'all']

export function RankingPage() {
  const [type, setType] = useState<RankingType>('popular')
  const [period, setPeriod] = useState<RankingPeriod>('all')
  const { data: entries = [], isLoading, isFetching } = useRanking(type, period, 50)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 font-display text-3xl font-bold tracking-tight">
          <Trophy className="h-7 w-7 text-wolf-ice" />
          Ranking
        </h1>
        <p className="mt-1 text-sm text-wolf-white/50">
          As obras em destaque na plataforma
        </p>
      </div>

      {/* Type tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto pb-1 border-b border-wolf-gray/40">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={cn(
              'shrink-0 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors sm:text-sm',
              type === t
                ? 'border-wolf-ice text-wolf-ice'
                : 'border-transparent text-wolf-white/50 hover:text-wolf-white/80'
            )}
          >
            {RANKING_TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Period filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
              period === p
                ? 'bg-wolf-ice text-wolf-black'
                : 'bg-wolf-gray/50 text-wolf-white/70 hover:bg-wolf-gray'
            )}
          >
            {RANKING_PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-xl border border-wolf-gray/30 bg-wolf-graphite/30 py-16 text-center">
          <Trophy className="mx-auto h-10 w-10 text-wolf-white/20" />
          <p className="mt-3 text-sm text-wolf-white/40">
            Nenhuma obra neste ranking para o período selecionado.
          </p>
        </div>
      ) : (
        <div className={cn('space-y-2', isFetching && 'opacity-70 transition-opacity')}>
          {entries.map((entry) => (
            <Link
              key={entry.id}
              to={`/title/${entry.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-wolf-gray/30 bg-wolf-graphite/40 p-3 transition-all hover:border-wolf-ice/40 hover:bg-wolf-graphite sm:gap-4 sm:p-4"
            >
              {/* Rank number */}
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold sm:h-10 sm:w-10',
                  entry.rank === 1 && 'bg-amber-500/20 text-amber-300',
                  entry.rank === 2 && 'bg-slate-300/20 text-slate-300',
                  entry.rank === 3 && 'bg-orange-700/20 text-orange-400',
                  entry.rank > 3 && 'bg-wolf-gray/40 text-wolf-white/50'
                )}
              >
                {entry.rank}
              </div>

              {/* Cover */}
              <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-wolf-gray/40 sm:h-16 sm:w-12">
                {entry.cover_url ? (
                  <img
                    src={entry.cover_url}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <BookOpen className="h-4 w-4 text-wolf-white/20" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-wolf-white group-hover:text-wolf-ice transition-colors">
                  {entry.title}
                </h3>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-wolf-white/45">
                  <span>{CATEGORY_LABELS[entry.category]}</span>
                  <span>•</span>
                  <span>{STATUS_LABELS[entry.status]}</span>
                  {entry.author && (
                    <>
                      <span>•</span>
                      <span>{entry.author}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="hidden shrink-0 text-right sm:block">
                <ScoreDisplay type={type} entry={entry} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function ScoreDisplay({
  type,
  entry,
}: {
  type: RankingType
  entry: { views: number; favorites_count: number; rating: number; score?: number }
}) {
  if (type === 'top_rated') {
    return (
      <div className="flex items-center gap-1 text-sm text-amber-300">
        <Star className="h-3.5 w-3.5 fill-amber-300" />
        {entry.rating.toFixed(1)}
      </div>
    )
  }
  if (type === 'most_favorited') {
    return (
      <div className="flex items-center gap-1 text-sm text-red-400">
        <Heart className="h-3.5 w-3.5" />
        {(entry.score ?? entry.favorites_count).toLocaleString('pt-BR')}
      </div>
    )
  }
  if (type === 'most_commented') {
    return (
      <div className="text-sm text-wolf-ice">
        {(entry.score ?? 0).toLocaleString('pt-BR')} comentários
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 text-sm text-wolf-white/50">
      <Eye className="h-3.5 w-3.5" />
      {(entry.score ?? entry.views).toLocaleString('pt-BR')}
    </div>
  )
}
