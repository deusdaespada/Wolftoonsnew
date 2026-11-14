import { Link } from 'react-router-dom'
import { BookOpen, Star, Eye } from 'lucide-react'
import type { TitleListItem } from '@/types/title'
import { CATEGORY_LABELS, STATUS_LABELS } from '@/types/title'
import { formatRelativeTime, cn } from '@/lib/utils'

interface TitleCardProps {
  title: TitleListItem
  size?: 'sm' | 'md' | 'lg'
  showStatus?: boolean
  className?: string
}

const STATUS_COLORS: Record<string, string> = {
  ongoing: 'bg-emerald-500/90 text-white',
  completed: 'bg-wolf-ice/90 text-wolf-black',
  hiatus: 'bg-amber-500/90 text-wolf-black',
  cancelled: 'bg-red-500/80 text-white',
}

const sizes = {
  sm: 'w-[110px]',
  md: 'w-[140px] sm:w-[150px]',
  lg: 'w-[160px] sm:w-[180px]',
}

export function TitleCard({
  title,
  size = 'md',
  showStatus = true,
  className,
}: TitleCardProps) {
  return (
    <Link
      to={`/title/${title.slug}`}
      className={cn(
        'group flex flex-col gap-2 transition-all duration-300',
        sizes[size],
        className
      )}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-wolf-gray/40 border border-wolf-gray/30 group-hover:border-wolf-ice/50 group-hover:shadow-wolf transition-all duration-300">
        {title.cover_url ? (
          <img
            src={title.cover_url}
            alt={title.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-wolf-graphite to-wolf-deep">
            <BookOpen className="h-10 w-10 text-wolf-white/20" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover CTA */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="flex items-center justify-center rounded-lg bg-wolf-ice/95 py-1.5 text-[11px] font-bold text-wolf-black shadow-lg">
            Ver obra
          </span>
        </div>

        {showStatus && (
          <span
            className={cn(
              'absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm',
              STATUS_COLORS[title.status] ?? 'bg-wolf-gray/80 text-wolf-white/80'
            )}
          >
            {STATUS_LABELS[title.status] ?? title.status}
          </span>
        )}

        {title.rating > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold text-amber-300 backdrop-blur-sm group-hover:opacity-0 transition-opacity">
            <Star className="h-3 w-3 fill-amber-300" />
            {title.rating.toFixed(1)}
          </div>
        )}

        {title.chapters_count > 0 && (
          <div className="absolute bottom-2 left-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-wolf-white/90 backdrop-blur-sm group-hover:opacity-0 transition-opacity">
            {title.chapters_count} caps
          </div>
        )}
      </div>

      <div className="space-y-0.5 px-0.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-wolf-white group-hover:text-wolf-ice transition-colors">
          {title.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] text-wolf-white/45">
          <span>{CATEGORY_LABELS[title.category] ?? title.category}</span>
          {title.views > 0 && (
            <>
              <span className="text-wolf-white/25">·</span>
              <span className="inline-flex items-center gap-0.5">
                <Eye className="h-3 w-3" />
                {title.views >= 1000
                  ? `${(title.views / 1000).toFixed(1)}k`
                  : title.views}
              </span>
            </>
          )}
        </div>
        {title.last_chapter_at && (
          <p className="text-[10px] text-wolf-white/35">
            {formatRelativeTime(title.last_chapter_at)}
          </p>
        )}
      </div>
    </Link>
  )
}
