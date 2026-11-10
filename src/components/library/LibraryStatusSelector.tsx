import { useState, useRef, useEffect } from 'react'
import { BookOpen, ChevronDown, Check, Trash2 } from 'lucide-react'
import {
  useLibraryEntry,
  useSetLibraryStatus,
  useRemoveFromLibrary,
} from '@/features/library/hooks'
import { useAuthStore } from '@/stores/authStore'
import {
  LIBRARY_STATUS_LABELS,
  LIBRARY_STATUS_ORDER,
  type LibraryStatus,
} from '@/types/library'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

interface LibraryStatusSelectorProps {
  titleId: string
  className?: string
}

export function LibraryStatusSelector({ titleId, className }: LibraryStatusSelectorProps) {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { data: entry, isLoading } = useLibraryEntry(titleId)
  const setStatus = useSetLibraryStatus()
  const remove = useRemoveFromLibrary()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) {
    return (
      <Button
        variant="secondary"
        size="lg"
        onClick={() => navigate('/login')}
        className={className}
      >
        <BookOpen className="h-4 w-4" />
        Adicionar à biblioteca
      </Button>
    )
  }

  const currentStatus = entry?.status as LibraryStatus | undefined

  const handleSelect = (status: LibraryStatus) => {
    setStatus.mutate({ titleId, status })
    setOpen(false)
  }

  const handleRemove = () => {
    remove.mutate(titleId)
    setOpen(false)
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <Button
        variant={currentStatus ? 'secondary' : 'primary'}
        size="lg"
        onClick={() => setOpen(!open)}
        isLoading={isLoading || setStatus.isPending}
        className="min-w-[160px]"
      >
        <BookOpen className="h-4 w-4" />
        {currentStatus ? LIBRARY_STATUS_LABELS[currentStatus] : 'Biblioteca'}
        <ChevronDown className="h-4 w-4 opacity-60" />
      </Button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-52 origin-top-left animate-scale-in rounded-xl border border-wolf-gray/50 bg-wolf-graphite p-1.5 shadow-wolf-lg">
          {LIBRARY_STATUS_ORDER.map((status) => (
            <button
              key={status}
              onClick={() => handleSelect(status)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors',
                currentStatus === status
                  ? 'bg-wolf-ice/20 text-wolf-ice font-medium'
                  : 'text-wolf-white/80 hover:bg-wolf-gray/40 hover:text-wolf-white'
              )}
            >
              {LIBRARY_STATUS_LABELS[status]}
              {currentStatus === status && <Check className="h-4 w-4" />}
            </button>
          ))}
          {currentStatus && (
            <>
              <div className="my-1 border-t border-wolf-gray/40" />
              <button
                onClick={handleRemove}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Remover
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
