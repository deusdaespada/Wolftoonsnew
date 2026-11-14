import { BookOpen } from 'lucide-react'
import { TitleCard } from './TitleCard'
import type { TitleListItem } from '@/types/title'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

interface TitleGridProps {
  titles: TitleListItem[]
  className?: string
  emptyMessage?: string
}

export function TitleGrid({
  titles,
  className,
  emptyMessage = 'Nenhuma obra encontrada.',
}: TitleGridProps) {
  if (titles.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title={emptyMessage}
        description="Tente outros filtros ou explore o catálogo completo."
        actionLabel="Ver catálogo"
        actionHref="/catalog"
      />
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
        className
      )}
    >
      {titles.map((title, i) => (
        <div
          key={title.id}
          className="animate-fade-in w-full"
          style={{ animationDelay: `${Math.min(i * 30, 150)}ms`, animationFillMode: 'both' }}
        >
          <TitleCard title={title} className="w-full" />
        </div>
      ))}
    </div>
  )
}
