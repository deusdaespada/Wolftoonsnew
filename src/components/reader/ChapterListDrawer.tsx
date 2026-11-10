import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useReaderStore } from '@/stores/readerStore'
import type { ChapterNav } from '@/types/reader'
import { cn } from '@/lib/utils'

interface ChapterListDrawerProps {
  nav: ChapterNav
}

export function ChapterListDrawer({ nav }: ChapterListDrawerProps) {
  const { showChapterList, setShowChapterList } = useReaderStore()

  if (!showChapterList) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowChapterList(false)}
      />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-wolf-graphite border-l border-wolf-gray/40 animate-slide-up shadow-wolf-lg">
        <div className="flex items-center justify-between border-b border-wolf-gray/40 px-4 py-4">
          <h3 className="font-semibold text-wolf-white">Capítulos</h3>
          <button
            onClick={() => setShowChapterList(false)}
            className="rounded-lg p-1.5 text-wolf-white/60 hover:bg-wolf-gray/40 hover:text-wolf-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {[...nav.allChapters].reverse().map((ch) => {
            const isCurrent = Number(ch.number) === Number(nav.current.number)
            return (
              <Link
                key={ch.id}
                to={`/read/${nav.title.slug}/${ch.number}`}
                onClick={() => setShowChapterList(false)}
                className={cn(
                  'block rounded-lg px-4 py-3 text-sm transition-colors',
                  isCurrent
                    ? 'bg-wolf-ice/20 text-wolf-ice font-medium'
                    : 'text-wolf-white/80 hover:bg-wolf-gray/40 hover:text-wolf-white'
                )}
              >
                <span className="font-medium">Cap. {ch.number}</span>
                {ch.title && (
                  <span className="ml-2 text-wolf-white/50">{ch.title}</span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
