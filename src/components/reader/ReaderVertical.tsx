import { useEffect, useRef, useCallback } from 'react'
import type { ChapterPage } from '@/types/database'
import { useReaderStore } from '@/stores/readerStore'
import { cn } from '@/lib/utils'

interface ReaderVerticalProps {
  pages: ChapterPage[]
  onProgress?: (page: number, percent: number) => void
  initialPage?: number
}

export function ReaderVertical({ pages, onProgress, initialPage = 1 }: ReaderVerticalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])
  const { settings } = useReaderStore()
  const width = settings.image.imageWidth

  const reportProgress = useCallback(() => {
    if (!containerRef.current || pages.length === 0 || !onProgress) return

    const container = containerRef.current
    const scrollTop = window.scrollY
    const viewportHeight = window.innerHeight
    const mid = scrollTop + viewportHeight / 2

    let currentPage = 1
    for (let i = 0; i < pageRefs.current.length; i++) {
      const el = pageRefs.current[i]
      if (!el) continue
      const rect = el.getBoundingClientRect()
      const top = rect.top + scrollTop
      const bottom = top + rect.height
      if (mid >= top && mid <= bottom) {
        currentPage = i + 1
        break
      }
      if (mid > bottom) currentPage = i + 1
    }

    const docHeight = document.documentElement.scrollHeight - viewportHeight
    const percent = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0
    onProgress(currentPage, percent)
  }, [pages.length, onProgress])

  useEffect(() => {
    const handler = () => reportProgress()
    window.addEventListener('scroll', handler, { passive: true })
    // Initial report after images may load
    const t = setTimeout(reportProgress, 500)
    return () => {
      window.removeEventListener('scroll', handler)
      clearTimeout(t)
    }
  }, [reportProgress])

  // Scroll to initial page
  useEffect(() => {
    if (initialPage <= 1) return
    const el = pageRefs.current[initialPage - 1]
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'auto', block: 'start' })
      }, 300)
    }
  }, [initialPage])

  if (pages.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-wolf-white/40">
        Nenhuma página disponível neste capítulo.
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center bg-black">
      {pages.map((page, index) => (
        <div
          key={page.id}
          ref={(el) => {
            pageRefs.current[index] = el
          }}
          className="relative w-full flex justify-center"
          data-page={page.page_number}
        >
          <img
            src={page.image_url}
            alt={`Página ${page.page_number}`}
            className={cn('h-auto select-none', settings.image.fitToWidth ? 'w-full' : '')}
            style={{
              maxWidth: settings.image.fitToWidth ? `${width}%` : undefined,
              width: settings.image.fitToWidth ? undefined : `${width}%`,
            }}
            loading={index < 3 ? 'eager' : 'lazy'}
            draggable={false}
          />
        </div>
      ))}
    </div>
  )
}
