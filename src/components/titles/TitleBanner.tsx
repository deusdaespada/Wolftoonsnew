import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, BookOpen } from 'lucide-react'
import type { TitleListItem } from '@/types/title'
import { CATEGORY_LABELS, STATUS_LABELS } from '@/types/title'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface TitleBannerProps {
  titles: TitleListItem[]
  isLoading?: boolean
}

export function TitleBanner({ titles, isLoading }: TitleBannerProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (titles.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % titles.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [titles.length])

  if (isLoading) {
    return (
      <div className="relative h-[320px] sm:h-[400px] lg:h-[460px] animate-pulse bg-wolf-graphite rounded-2xl" />
    )
  }

  if (titles.length === 0) {
    return (
      <div className="relative flex h-[280px] sm:h-[360px] items-center justify-center rounded-2xl border border-wolf-gray/40 bg-wolf-graphite">
        <div className="text-center space-y-3">
          <BookOpen className="mx-auto h-12 w-12 text-wolf-white/20" />
          <p className="text-wolf-white/50">Nenhuma obra em destaque ainda.</p>
          <p className="text-xs text-wolf-white/30">Cadastre obras no painel administrativo.</p>
        </div>
      </div>
    )
  }

  const title = titles[current]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-wolf-gray/40">
      {/* Background */}
      <div className="absolute inset-0">
        {title.cover_url ? (
          <img
            src={title.cover_url}
            alt=""
            className="h-full w-full object-cover scale-110 blur-2xl opacity-30"
          />
        ) : (
          <div className="h-full w-full bg-wolf-deep" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-wolf-black via-wolf-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-wolf-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-10 p-6 sm:p-10 min-h-[320px] sm:min-h-[400px]">
        {/* Cover */}
        <Link to={`/title/${title.slug}`} className="shrink-0">
          <div className="w-[140px] sm:w-[180px] aspect-[2/3] overflow-hidden rounded-xl border border-wolf-gray/40 shadow-wolf-lg transition-transform hover:scale-[1.02]">
            {title.cover_url ? (
              <img src={title.cover_url} alt={title.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-wolf-graphite">
                <BookOpen className="h-12 w-12 text-wolf-white/20" />
              </div>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="rounded-md bg-wolf-ice/20 px-2 py-0.5 text-xs font-semibold text-wolf-ice">
              {CATEGORY_LABELS[title.category]}
            </span>
            <span className="rounded-md bg-wolf-gray/60 px-2 py-0.5 text-xs text-wolf-white/70">
              {STATUS_LABELS[title.status]}
            </span>
            {title.rating > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-300">
                <Star className="h-3.5 w-3.5 fill-amber-300" />
                {title.rating.toFixed(1)}
              </span>
            )}
          </div>

          <Link to={`/title/${title.slug}`}>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-wolf-white hover:text-wolf-ice transition-colors line-clamp-2">
              {title.title}
            </h2>
          </Link>

          {title.author && (
            <p className="text-sm text-wolf-white/50">por {title.author}</p>
          )}

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-wolf-white/60">
            {title.chapters_count > 0 && <span>{title.chapters_count} capítulos</span>}
            {title.views > 0 && <span>{title.views.toLocaleString('pt-BR')} views</span>}
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-2">
            <Link to={`/title/${title.slug}`}>
              <Button size="lg">Ver obra</Button>
            </Link>
            {title.chapters_count > 0 && (
              <Link to={`/read/${title.slug}/1`}>
                <Button variant="secondary" size="lg">
                  Ler agora
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation dots + arrows */}
      {titles.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + titles.length) % titles.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-wolf-white/80 hover:bg-black/70 hover:text-white transition-all hidden sm:block"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % titles.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-wolf-white/80 hover:bg-black/70 hover:text-white transition-all hidden sm:block"
            aria-label="Próximo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {titles.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === current ? 'w-6 bg-wolf-ice' : 'w-1.5 bg-wolf-white/30 hover:bg-wolf-white/50'
                )}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
