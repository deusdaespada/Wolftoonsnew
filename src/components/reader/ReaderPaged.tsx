import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ChapterPage } from '@/types/database'
import { useReaderStore } from '@/stores/readerStore'
import { cn } from '@/lib/utils'

interface ReaderPagedProps {
  pages: ChapterPage[]
  onProgress?: (page: number, percent: number) => void
  initialPage?: number
  mode?: 'horizontal' | 'paged'
}

export function ReaderPaged({
  pages,
  onProgress,
  initialPage = 1,
  mode = 'paged',
}: ReaderPagedProps) {
  const [currentIndex, setCurrentIndex] = useState(Math.max(0, initialPage - 1))
  const { settings } = useReaderStore()
  const width = settings.image.imageWidth

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= pages.length) return
      setCurrentIndex(index)
      const percent = pages.length > 1 ? Math.round((index / (pages.length - 1)) * 100) : 100
      onProgress?.(index + 1, percent)
    },
    [pages.length, onProgress]
  )

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'd') {
        e.preventDefault()
        goTo(currentIndex + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault()
        goTo(currentIndex - 1)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentIndex, goTo])

  // Report initial
  useEffect(() => {
    if (pages.length > 0) {
      const percent = pages.length > 1 ? Math.round((currentIndex / (pages.length - 1)) * 100) : 100
      onProgress?.(currentIndex + 1, percent)
    }
  }, []) // eslint-disable-line

  if (pages.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-wolf-white/40">
        Nenhuma página disponível neste capítulo.
      </div>
    )
  }

  const page = pages[currentIndex]

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center bg-black select-none">
      {/* Click zones */}
      <button
        className="absolute left-0 top-0 z-10 h-full w-1/3 cursor-w-resize opacity-0"
        onClick={() => goTo(currentIndex - 1)}
        aria-label="Página anterior"
      />
      <button
        className="absolute right-0 top-0 z-10 h-full w-1/3 cursor-e-resize opacity-0"
        onClick={() => goTo(currentIndex + 1)}
        aria-label="Próxima página"
      />

      {/* Image */}
      <div className="flex items-center justify-center px-2">
        <img
          src={page.image_url}
          alt={`Página ${page.page_number}`}
          className={cn('max-h-[calc(100vh-6rem)] h-auto object-contain')}
          style={{
            maxWidth: `${width}%`,
            width: mode === 'horizontal' ? `${width}%` : undefined,
          }}
          draggable={false}
        />
      </div>

      {/* Nav arrows (desktop) */}
      {currentIndex > 0 && (
        <button
          onClick={() => goTo(currentIndex - 1)}
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white/80 hover:bg-black/80 hover:text-white transition-all hidden sm:flex"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {currentIndex < pages.length - 1 && (
        <button
          onClick={() => goTo(currentIndex + 1)}
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white/80 hover:bg-black/80 hover:text-white transition-all hidden sm:flex"
          aria-label="Próxima"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Page indicator */}
      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs text-white/80">
        {currentIndex + 1} / {pages.length}
      </div>
    </div>
  )
}
