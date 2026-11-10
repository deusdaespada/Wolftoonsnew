import { useEffect, useRef, useCallback } from 'react'
import { useReaderStore } from '@/stores/readerStore'
import { cn } from '@/lib/utils'

interface ReaderNovelProps {
  content: string
  chapterTitle?: string | null
  onProgress?: (page: number, percent: number) => void
}

const FONT_MAP = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
}

export function ReaderNovel({ content, chapterTitle, onProgress }: ReaderNovelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { settings } = useReaderStore()
  const novel = settings.novel

  const reportProgress = useCallback(() => {
    if (!onProgress) return
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const percent = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0
    onProgress(1, percent)
  }, [onProgress])

  useEffect(() => {
    const handler = () => reportProgress()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [reportProgress])

  if (!content || content.trim().length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-wolf-white/40">
        Conteúdo do capítulo indisponível.
      </div>
    )
  }

  // Simple paragraph split for better readability
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim())

  return (
    <div className="min-h-screen bg-wolf-black">
      <article
        ref={containerRef}
        className={cn('mx-auto px-5 py-10 sm:px-8', FONT_MAP[novel.fontFamily])}
        style={{
          maxWidth: `${novel.maxWidth}px`,
          fontSize: `${novel.fontSize}px`,
          lineHeight: novel.lineHeight,
        }}
      >
        {chapterTitle && (
          <h1 className="mb-8 font-display text-2xl font-bold tracking-tight text-wolf-white sm:text-3xl">
            {chapterTitle}
          </h1>
        )}

        <div className="space-y-5 text-wolf-white/90">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-justify">
              {p.trim()}
            </p>
          ))}
        </div>
      </article>
    </div>
  )
}
