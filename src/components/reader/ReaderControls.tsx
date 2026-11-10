import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  List,
  Settings,
  Maximize,
  Minimize,
  ArrowLeft,
  BookOpen,
} from 'lucide-react'
import { useReaderStore } from '@/stores/readerStore'
import type { ChapterNav } from '@/types/reader'
import { cn } from '@/lib/utils'

interface ReaderControlsProps {
  nav: ChapterNav
  progressPercent: number
  isNovel: boolean
}

export function ReaderControls({ nav, progressPercent, isNovel }: ReaderControlsProps) {
  const {
    showControls,
    setShowControls,
    setShowChapterList,
    setShowSettings,
    settings,
    setFullscreen,
  } = useReaderStore()

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.()
      setFullscreen(true)
    } else {
      await document.exitFullscreen?.()
      setFullscreen(false)
    }
  }

  if (!showControls) {
    return (
      <button
        onClick={() => setShowControls(true)}
        className="fixed top-0 left-0 z-40 h-12 w-full opacity-0"
        aria-label="Mostrar controles"
      />
    )
  }

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-wolf-gray/40 bg-wolf-black/95 backdrop-blur-md animate-slide-up">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-3 sm:px-4">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              to={`/title/${nav.title.slug}`}
              className="rounded-lg p-2 text-wolf-white/70 hover:bg-wolf-gray/40 hover:text-wolf-white transition-colors"
              aria-label="Voltar à obra"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-wolf-white">
                {nav.title.title}
              </p>
              <p className="truncate text-xs text-wolf-white/50">
                Cap. {nav.current.number}
                {nav.current.title ? ` — ${nav.current.title}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowChapterList(true)}
              className="rounded-lg p-2 text-wolf-white/70 hover:bg-wolf-gray/40 hover:text-wolf-white transition-colors"
              title="Lista de capítulos"
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="rounded-lg p-2 text-wolf-white/70 hover:bg-wolf-gray/40 hover:text-wolf-white transition-colors"
              title="Configurações"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="rounded-lg p-2 text-wolf-white/70 hover:bg-wolf-gray/40 hover:text-wolf-white transition-colors hidden sm:block"
              title="Tela cheia"
            >
              {settings.fullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setShowControls(false)}
              className="rounded-lg p-2 text-wolf-white/50 hover:bg-wolf-gray/40 hover:text-wolf-white transition-colors text-xs"
              title="Ocultar controles"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 w-full bg-wolf-gray/30">
          <div
            className="h-full bg-wolf-ice transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Bottom navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-wolf-gray/40 bg-wolf-black/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3 sm:px-4">
          {nav.previous ? (
            <Link
              to={`/read/${nav.title.slug}/${nav.previous.number}`}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-wolf-white/80 hover:bg-wolf-gray/40 hover:text-wolf-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Cap. {nav.previous.number}</span>
              <span className="sm:hidden">Anterior</span>
            </Link>
          ) : (
            <div className="w-24" />
          )}

          <button
            onClick={() => setShowChapterList(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-wolf-white/70 hover:bg-wolf-gray/40 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Capítulos</span>
          </button>

          {nav.next ? (
            <Link
              to={`/read/${nav.title.slug}/${nav.next.number}`}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-wolf-white/80 hover:bg-wolf-gray/40 hover:text-wolf-white transition-colors"
            >
              <span className="hidden sm:inline">Cap. {nav.next.number}</span>
              <span className="sm:hidden">Próximo</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <div className="w-24" />
          )}
        </div>
      </footer>
    </>
  )
}
