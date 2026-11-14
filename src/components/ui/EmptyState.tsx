import type { LucideIcon } from 'lucide-react'
import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './Button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  icon: Icon = BookOpen,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-wolf-gray/40 bg-wolf-graphite/30 px-6 py-16 text-center',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-wolf-gray/40">
        <Icon className="h-7 w-7 text-wolf-white/30" />
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-wolf-white/80">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-wolf-white/40">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link to={actionHref} className="mt-5">
          <Button size="sm">{actionLabel}</Button>
        </Link>
      )}
    </div>
  )
}
