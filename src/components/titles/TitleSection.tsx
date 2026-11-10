import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { TitleCard } from './TitleCard'
import { Spinner } from '@/components/ui/Spinner'
import type { TitleListItem } from '@/types/title'
import { cn } from '@/lib/utils'

interface TitleSectionProps {
  title: string
  subtitle?: string
  titles: TitleListItem[]
  isLoading?: boolean
  viewAllHref?: string
  className?: string
}

export function TitleSection({
  title,
  subtitle,
  titles,
  isLoading,
  viewAllHref,
  className,
}: TitleSectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-wolf-white/50">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="flex items-center gap-1 text-sm font-medium text-wolf-ice hover:underline"
          >
            Ver todos
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : titles.length === 0 ? (
        <div className="rounded-xl border border-wolf-gray/30 bg-wolf-graphite/30 py-12 text-center">
          <p className="text-sm text-wolf-white/40">Nenhuma obra nesta seção ainda.</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
          {titles.map((t) => (
            <TitleCard key={t.id} title={t} size="md" />
          ))}
        </div>
      )}
    </section>
  )
}
