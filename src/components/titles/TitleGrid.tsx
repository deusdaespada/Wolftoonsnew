import { TitleCard } from './TitleCard'
import type { TitleListItem } from '@/types/title'
import { cn } from '@/lib/utils'

interface TitleGridProps {
  titles: TitleListItem[]
  className?: string
  emptyMessage?: string
}

export function TitleGrid({ titles, className, emptyMessage = 'Nenhuma obra encontrada.' }: TitleGridProps) {
  if (titles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-wolf-white/50">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
        className
      )}
    >
      {titles.map((title) => (
        <TitleCard key={title.id} title={title} className="w-full" />
      ))}
    </div>
  )
}
