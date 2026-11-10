import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { useLibrary } from '@/features/library/hooks'
import { TitleCard } from '@/components/titles/TitleCard'
import { Spinner } from '@/components/ui/Spinner'
import {
  LIBRARY_STATUS_LABELS,
  LIBRARY_STATUS_ORDER,
  type LibraryStatus,
} from '@/types/library'
import { cn } from '@/lib/utils'

export function LibraryPage() {
  const [status, setStatus] = useState<LibraryStatus | 'all'>('all')
  const { data: entries, isLoading, error } = useLibrary(
    status === 'all' ? undefined : status
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Minha Biblioteca</h1>
        <p className="mt-1 text-sm text-wolf-white/50">
          Organize suas obras por status de leitura
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 overflow-x-auto pb-1 border-b border-wolf-gray/40">
        <TabButton active={status === 'all'} onClick={() => setStatus('all')}>
          Todas
        </TabButton>
        {LIBRARY_STATUS_ORDER.map((s) => (
          <TabButton key={s} active={status === s} onClick={() => setStatus(s)}>
            {LIBRARY_STATUS_LABELS[s]}
          </TabButton>
        ))}
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 py-12 text-center text-red-300">
          Erro ao carregar a biblioteca.
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : !entries || entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="h-12 w-12 text-wolf-white/20" />
          <p className="mt-4 text-wolf-white/50">
            {status === 'all'
              ? 'Sua biblioteca está vazia.'
              : `Nenhuma obra em "${LIBRARY_STATUS_LABELS[status as LibraryStatus]}".`}
          </p>
          <Link
            to="/catalog"
            className="mt-4 text-sm font-medium text-wolf-ice hover:underline"
          >
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {entries.map((entry) => (
            <div key={entry.id} className="relative">
              <TitleCard title={entry.title} className="w-full" showStatus={false} />
              <span className="mt-1 block text-center text-[10px] font-medium text-wolf-ice/80">
                {LIBRARY_STATUS_LABELS[entry.status as LibraryStatus]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'border-wolf-ice text-wolf-ice'
          : 'border-transparent text-wolf-white/50 hover:text-wolf-white/80'
      )}
    >
      {children}
    </button>
  )
}
