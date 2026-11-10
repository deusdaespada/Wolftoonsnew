import { useParams, Link } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useChapter, useReadingProgress, useSaveProgress, useTrackChapterView } from '@/features/chapters/hooks'
import { useReaderStore } from '@/stores/readerStore'
import { ReaderVertical } from '@/components/reader/ReaderVertical'
import { ReaderPaged } from '@/components/reader/ReaderPaged'
import { ReaderNovel } from '@/components/reader/ReaderNovel'
import { ReaderControls } from '@/components/reader/ReaderControls'
import { ChapterListDrawer } from '@/components/reader/ChapterListDrawer'
import { ReaderSettingsPanel } from '@/components/reader/ReaderSettingsPanel'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'

export function ReaderPage() {
  const { slug, chapter: chapterParam } = useParams<{ slug: string; chapter: string }>()
  const chapterNumber = Number(chapterParam)
  const { data: nav, isLoading, error } = useChapter(slug ?? '', chapterNumber)
  const { data: savedProgress } = useReadingProgress(nav?.current.id)
  const saveProgress = useSaveProgress()
  const { settings, setShowControls, toggleControls } = useReaderStore()
  const user = useAuthStore((s) => s.user)

  const [progressPercent, setProgressPercent] = useState(0)
  const lastSavedRef = useRef({ page: 0, percent: 0 })
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useTrackChapterView(nav?.current.id)

  const isNovel =
    nav?.current.content_type === 'text' ||
    ['novel', 'light_novel', 'web_novel'].includes(nav?.title.category ?? '')

  // Hide main site header/footer feel — reader is immersive
  useEffect(() => {
    document.body.style.overflow = 'auto'
    return () => {
      // cleanup
    }
  }, [])

  // Keyboard: toggle controls with Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowControls(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setShowControls])

  const handleProgress = useCallback(
    (page: number, percent: number) => {
      setProgressPercent(percent)

      if (!user || !nav || !settings.autoProgress) return

      // Throttle saves
      const last = lastSavedRef.current
      if (Math.abs(percent - last.percent) < 5 && page === last.page) return

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

      saveTimeoutRef.current = setTimeout(() => {
        lastSavedRef.current = { page, percent }
        saveProgress.mutate({
          titleId: nav.title.id,
          chapterId: nav.current.id,
          lastPage: page,
          progressPercent: percent,
        })
      }, 1500)
    },
    [user, nav, settings.autoProgress, saveProgress]
  )

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !nav) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-wolf-black px-4 text-center">
        <h1 className="font-display text-2xl font-bold text-wolf-white">Capítulo não encontrado</h1>
        <p className="text-wolf-white/50">
          Este capítulo não existe ou ainda não foi publicado.
        </p>
        <div className="flex gap-3">
          {slug && (
            <Link to={`/title/${slug}`}>
              <Button variant="secondary">Voltar à obra</Button>
            </Link>
          )}
          <Link to="/catalog">
            <Button>Catálogo</Button>
          </Link>
        </div>
      </div>
    )
  }

  const initialPage = savedProgress?.last_page ?? 1

  return (
    <div className="relative min-h-screen bg-black">
      {/* Click center to toggle controls */}
      <div
        className="fixed inset-0 z-0"
        onClick={(e) => {
          // Only toggle if clicking the background, not interactive elements
          if ((e.target as HTMLElement).closest('button, a, input, img')) return
        }}
      />

      {/* Top/bottom spacing for controls */}
      <div className="pt-14 pb-14">
        {isNovel ? (
          <ReaderNovel
            content={nav.current.text_content ?? ''}
            chapterTitle={
              nav.current.title
                ? `Cap. ${nav.current.number} — ${nav.current.title}`
                : `Capítulo ${nav.current.number}`
            }
            onProgress={handleProgress}
          />
        ) : settings.image.mode === 'vertical' ? (
          <ReaderVertical
            pages={nav.current.pages}
            onProgress={handleProgress}
            initialPage={initialPage}
          />
        ) : (
          <ReaderPaged
            pages={nav.current.pages}
            onProgress={handleProgress}
            initialPage={initialPage}
            mode={settings.image.mode === 'horizontal' ? 'horizontal' : 'paged'}
          />
        )}
      </div>

      {/* End of chapter CTA */}
      {progressPercent >= 95 && nav.next && (
        <div className="flex justify-center bg-wolf-black px-4 py-10">
          <Link to={`/read/${nav.title.slug}/${nav.next.number}`}>
            <Button size="lg">
              Próximo capítulo — Cap. {nav.next.number}
            </Button>
          </Link>
        </div>
      )}

      {progressPercent >= 95 && !nav.next && (
        <div className="flex flex-col items-center gap-3 bg-wolf-black px-4 py-10 text-center">
          <p className="text-wolf-white/60">Você chegou ao fim dos capítulos disponíveis.</p>
          <Link to={`/title/${nav.title.slug}`}>
            <Button variant="secondary">Voltar à obra</Button>
          </Link>
        </div>
      )}

      <ReaderControls nav={nav} progressPercent={progressPercent} isNovel={!!isNovel} />
      <ChapterListDrawer nav={nav} />
      <ReaderSettingsPanel isNovel={!!isNovel} />
    </div>
  )
}
