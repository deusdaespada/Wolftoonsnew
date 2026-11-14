import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-lg', className)} />
}

export function TitleCardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const widths = { sm: 'w-[110px]', md: 'w-[140px] sm:w-[150px]', lg: 'w-[160px] sm:w-[180px]' }
  return (
    <div className={cn('flex flex-col gap-2', widths[size])}>
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="h-4 w-4/5 rounded" />
      <Skeleton className="h-3 w-1/2 rounded" />
    </div>
  )
}
