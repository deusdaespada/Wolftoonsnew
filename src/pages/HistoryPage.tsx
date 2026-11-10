import { Link } from 'react-router-dom'
import { History, BookOpen } from 'lucide-react'
import { useReadingHistory } from '@/features/library/hooks'
import { Spinner } from '@/components/ui/Spinner'
import { formatRelativeTime } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/types/title'

export function HistoryPage() {
  const { data: entries, isLoading, error } = useReadingHistory(50)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Histórico de Leitura</h1>
        <p className="mt-1 text-sm text-wolf-white/50">
          Capítulos que você leu recentemente
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 py-12 text-center text-red-300">
          Erro ao carregar o histórico.
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : !entries || entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <History className="h-12 w-12 text-wolf-white/20" />
          <p className="mt-4 text-wolf-white/50">Nenhuma leitura registrada ainda.</p>
          <Link to="/catalog" className="mt-4 text-sm font-medium text-wolf-ice hover:underline">
            Começar a ler
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              to={`/read/${entry.title.slug}/${entry.chapter.number}`}
              className="group flex items-center gap-4 rounded-xl border border-wolf-gray/30 bg-wolf-graphite/40 p-3 transition-all hover:border-wolf-ice/40 hover:bg-wolf-graphite sm:p-4"
            >
              {/* Cover */}
              <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-wolf-gray/40 sm:h-20 sm:w-14">
                {entry.title.cover_url ? (
                  <img
                    src={entry.title.cover_url}
                    alt={entry.title.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <BookOpen className="h-5 w-5 text-wolf-white/20" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-wolf-white group-hover:text-wolf-ice transition-colors">
                  {entry.title.title}
                </h3>
                <p className="mt-0.5 text-xs text-wolf-white/50">
                  Cap. {entry.chapter.number}
                  {entry.chapter.title && ` — ${entry.chapter.title}`}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-[11px] text-wolf-white/40">
                  <span>{CATEGORY_LABELS[entry.title.category]}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(entry.last_read_at)}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="hidden shrink-0 text-right sm:block">
                <div className="text-xs font-medium text-wolf-ice">
                  {Math.round(entry.progress_percent)}%
                </div>
                <div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-wolf-gray/50">
                  <div
                    className="h-full rounded-full bg-wolf-ice"
                    style={{ width: `${entry.progress_percent}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
