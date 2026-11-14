import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { TitleListItem } from '@/types/title'
import { TitleCard } from './TitleCard'
import { TitleCardSkeleton } from '@/components/ui/Skeleton'

interface TitleSectionProps {
  title: string
  subtitle?: string
  titles: TitleListItem[]
  isLoading?: boolean
  viewAllHref?: string
}

export function TitleSection({
  title,
  subtitle,
  titles,
  isLoading,
  viewAllHref,
}: TitleSectionProps) {
  return (
    <section className="animate-slide-up">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-sm text-wolf-white/40">{subtitle}</p>
          )}
        </div>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="group flex shrink-0 items-center gap-1 text-sm font-medium text-wolf-ice hover:text-wolf-ice/80 transition-colors"
          >
            Ver todos
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <TitleCardSkeleton key={i} />
          ))}
        </div>
      ) : titles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-wolf-gray/30 bg-wolf-graphite/20 py-10 text-center text-sm text-wolf-white/35">
          Nenhuma obra nesta seção ainda.
        </div>
      ) : (
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-thin sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible md:grid-cols-5 lg:grid-cols-6 sm:px-0">
          {titles.map((t, i) => (
            <div
              key={t.id}
              className="shrink-0 animate-fade-in"
              style={{ animationDelay: `${Math.min(i * 40, 200)}ms`, animationFillMode: 'both' }}
            >
              <TitleCard title={t} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
