import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CatalogFilters, CatalogFilterPanel } from '@/components/catalog/CatalogFilters'
import { TitleGrid } from '@/components/titles/TitleGrid'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useCatalog, useGenres } from '@/features/titles/hooks'
import type { CatalogFilters as Filters } from '@/types/title'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: genres = [] } = useGenres()

  const [filters, setFilters] = useState<Filters>(() => ({
    search: searchParams.get('search') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    genres: searchParams.get('genres')?.split(',').filter(Boolean) ?? undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    sort: (searchParams.get('sort') as Filters['sort']) ?? 'popularity',
    page: Number(searchParams.get('page')) || 1,
    limit: 24,
  }))

  // Sync filters → URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.category) params.set('category', filters.category)
    if (filters.status) params.set('status', filters.status)
    if (filters.genres?.length) params.set('genres', filters.genres.join(','))
    if (filters.minRating) params.set('minRating', String(filters.minRating))
    if (filters.sort && filters.sort !== 'popularity') params.set('sort', filters.sort)
    if (filters.page && filters.page > 1) params.set('page', String(filters.page))
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  const { data, isLoading, isFetching, error } = useCatalog(filters)

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Catálogo</h1>
        <p className="mt-1 text-sm text-wolf-white/50">
          Explore todas as obras disponíveis na plataforma
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden w-56 shrink-0 lg:block">
          <CatalogFilterPanel
            filters={filters}
            genres={genres}
            onChange={setFilters}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-6">
          <CatalogFilters
            filters={filters}
            genres={genres}
            onChange={setFilters}
            totalResults={data?.count}
            isLoading={isLoading || isFetching}
          />

          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 py-12 text-center">
              <p className="text-red-300">Erro ao carregar o catálogo.</p>
              <p className="mt-1 text-xs text-red-300/60">{(error as Error).message}</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <TitleGrid
                titles={data?.data ?? []}
                emptyMessage="Nenhuma obra encontrada com os filtros selecionados."
              />

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={data.page <= 1}
                    onClick={() => handlePageChange(data.page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                      let pageNum: number
                      if (data.totalPages <= 5) {
                        pageNum = i + 1
                      } else if (data.page <= 3) {
                        pageNum = i + 1
                      } else if (data.page >= data.totalPages - 2) {
                        pageNum = data.totalPages - 4 + i
                      } else {
                        pageNum = data.page - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${
                            pageNum === data.page
                              ? 'bg-wolf-ice text-wolf-black'
                              : 'bg-wolf-gray/40 text-wolf-white/70 hover:bg-wolf-gray hover:text-wolf-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={data.page >= data.totalPages}
                    onClick={() => handlePageChange(data.page + 1)}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
