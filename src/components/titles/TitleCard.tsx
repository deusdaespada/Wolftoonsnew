import { Link } from 'react-router-dom'
import { Star, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'
import type { TitleListItem } from '@/types/title'
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/types/title'

interface TitleCardProps {
  title: TitleListItem
  className?: string
  showStatus?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function TitleCard({ title, className, showStatus = true, size = 'md' }: TitleCardProps) {
  const sizes = {
    sm: 'w-[120px]',
    md: 'w-[160px] sm:w-[180px]',
    lg: 'w-[180px] sm:w-[200px]',
  }

  return (
    <Link
      to={`/title/${title.slug}`}
      className={cn(
        'group flex flex-col gap-2 transition-all duration-200',
        sizes[size],
        className
      )}
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-wolf-gray/40 border border-wolf-gray/30 group-hover:border-wolf-ice/40 group-hover:shadow-wolf transition-all">
        {title.cover_url ? (
          <img
            src={title.cover_url}
            alt={title.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-wolf-graphite">
            <BookOpen className="h-10 w-10 text-wolf-white/20" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Status badge */}
        {showStatus && (
          <span
            className={cn(
              'absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
              STATUS_COLORS[title.status] ?? 'bg-wolf-gray/80 text-wolf-white/80'
            )}
          >
            {STATUS_LABELS[title.status] ?? title.status}
          </span>
        )}

        {/* Rating */}
        {title.rating > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-amber-300">
            <Star className="h-3 w-3 fill-amber-300" />
            {title.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-0.5 px-0.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-wolf-white group-hover:text-wolf-ice transition-colors">
          {title.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] text-wolf-white/50">
          <span>{CATEGORY_LABELS[title.category] ?? title.category}</span>
          {title.chapters_count > 0 && (
            <>
              <span>•</span>
              <span>{title.chapters_count} caps</span>
            </>
          )}
        </div>
        {title.last_chapter_at && (
          <p className="text-[10px] text-wolf-white/40">
            Atualizado {formatRelativeTime(title.last_chapter_at)}
          </p>
        )}
      </div>
    </Link>
  )
}
