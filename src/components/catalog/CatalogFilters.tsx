import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { CatalogFilters as Filters } from '@/types/title'
import type { Genre } from '@/types/database'
import { CATEGORY_LABELS, STATUS_LABELS } from '@/types/title'

interface CatalogFiltersProps {
  filters: Filters
  genres: Genre[]
  onChange: (filters: Filters) => void
  totalResults?: number
  isLoading?: boolean
}

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularidade' },
  { value: 'updated', label: 'Atualização' },
  { value: 'rating', label: 'Avaliação' },
  { value: 'newest', label: 'Mais recentes' },
  { value: 'title', label: 'A-Z' },
]

export function CatalogFilters({ filters, genres, onChange, totalResults, isLoading }: CatalogFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.search ?? '')

  const update = (partial: Partial<Filters>) => {
    onChange({ ...filters, ...partial, page: 1 })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    update({ search: searchInput.trim() })
  }

  const toggleGenre = (slug: string) => {
    const current = filters.genres ?? []
    const next = current.includes(slug)
      ? current.filter((g) => g !== slug)
      : [...current, slug]
    update({ genres: next })
  }

  const clearFilters = () => {
    setSearchInput('')
    onChange({ sort: filters.sort, page: 1, limit: filters.limit })
  }

  const hasActiveFilters =
    !!filters.search ||
    !!filters.category ||
    !!filters.status ||
    (filters.genres && filters.genres.length > 0) ||
    (filters.minRating && filters.minRating > 0)

  const FilterPanel = (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
          Categoria
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <button
              key={value}
              onClick={() => update({ category: filters.category === value ? undefined : value })}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                filters.category === value
                  ? 'bg-wolf-ice text-wolf-black'
                  : 'bg-wolf-gray/50 text-wolf-white/70 hover:bg-wolf-gray hover:text-wolf-white'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
          Status
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <button
              key={value}
              onClick={() => update({ status: filters.status === value ? undefined : value })}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                filters.status === value
                  ? 'bg-wolf-ice text-wolf-black'
                  : 'bg-wolf-gray/50 text-wolf-white/70 hover:bg-wolf-gray hover:text-wolf-white'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Genres */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
          Gêneros
        </h4>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {genres.map((genre) => {
            const active = filters.genres?.includes(genre.slug)
            return (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.slug)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                  active
                    ? 'bg-wolf-ice text-wolf-black'
                    : 'bg-wolf-gray/50 text-wolf-white/70 hover:bg-wolf-gray hover:text-wolf-white'
                )}
              >
                {genre.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Min Rating */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
          Nota mínima
        </h4>
        <div className="flex flex-wrap gap-2">
          {[0, 6, 7, 8, 9].map((val) => (
            <button
              key={val}
              onClick={() => update({ minRating: filters.minRating === val ? undefined : val })}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                (filters.minRating ?? 0) === val
                  ? 'bg-wolf-ice text-wolf-black'
                  : 'bg-wolf-gray/50 text-wolf-white/70 hover:bg-wolf-gray hover:text-wolf-white'
              )}
            >
              {val === 0 ? 'Todas' : `${val}+`}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4" />
          Limpar filtros
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Search + Sort bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wolf-white/40" />
          <input
            type="search"
            placeholder="Buscar por título ou autor..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-lg border border-wolf-gray/60 bg-wolf-black py-2.5 pl-10 pr-4 text-sm text-wolf-white placeholder:text-wolf-white/40 focus:border-wolf-ice focus:outline-none focus:ring-2 focus:ring-wolf-ice/20"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={filters.sort ?? 'popularity'}
            onChange={(e) => update({ sort: e.target.value as Filters['sort'] })}
            className="rounded-lg border border-wolf-gray/60 bg-wolf-black px-3 py-2.5 text-sm text-wolf-white focus:border-wolf-ice focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-2 rounded-lg border border-wolf-gray/60 bg-wolf-black px-3 py-2.5 text-sm text-wolf-white/80 hover:border-wolf-ice/40 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-wolf-ice text-[10px] font-bold text-wolf-black">
                !
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-wolf-white/50">
        <span>
          {isLoading ? 'Buscando...' : `${totalResults ?? 0} obra${(totalResults ?? 0) !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Mobile filters */}
      {mobileOpen && (
        <div className="rounded-xl border border-wolf-gray/40 bg-wolf-graphite p-4 lg:hidden animate-slide-up">
          {FilterPanel}
        </div>
      )}

      {/* Desktop sidebar is rendered by parent */}
      <div className="hidden lg:block" data-desktop-filters>
        {/* Parent will place sidebar */}
      </div>
    </div>
  )
}

// Export the panel for desktop sidebar usage
export function CatalogFilterPanel({
  filters,
  genres,
  onChange,
}: {
  filters: Filters
  genres: Genre[]
  onChange: (filters: Filters) => void
}) {
  const update = (partial: Partial<Filters>) => {
    onChange({ ...filters, ...partial, page: 1 })
  }

  const toggleGenre = (slug: string) => {
    const current = filters.genres ?? []
    const next = current.includes(slug)
      ? current.filter((g) => g !== slug)
      : [...current, slug]
    update({ genres: next })
  }

  const clearFilters = () => {
    onChange({ sort: filters.sort, page: 1, limit: filters.limit })
  }

  const hasActiveFilters =
    !!filters.search ||
    !!filters.category ||
    !!filters.status ||
    (filters.genres && filters.genres.length > 0) ||
    (filters.minRating && filters.minRating > 0)

  return (
    <aside className="space-y-6 sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-wolf-white">Filtros</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs text-wolf-ice hover:underline">
            Limpar
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
          Categoria
        </h4>
        <div className="flex flex-col gap-1">
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <button
              key={value}
              onClick={() => update({ category: filters.category === value ? undefined : value })}
              className={cn(
                'rounded-lg px-3 py-2 text-left text-sm transition-all',
                filters.category === value
                  ? 'bg-wolf-ice/20 text-wolf-ice font-medium'
                  : 'text-wolf-white/70 hover:bg-wolf-gray/40 hover:text-wolf-white'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
          Status
        </h4>
        <div className="flex flex-col gap-1">
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <button
              key={value}
              onClick={() => update({ status: filters.status === value ? undefined : value })}
              className={cn(
                'rounded-lg px-3 py-2 text-left text-sm transition-all',
                filters.status === value
                  ? 'bg-wolf-ice/20 text-wolf-ice font-medium'
                  : 'text-wolf-white/70 hover:bg-wolf-gray/40 hover:text-wolf-white'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Genres */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
          Gêneros
        </h4>
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
          {genres.map((genre) => {
            const active = filters.genres?.includes(genre.slug)
            return (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.slug)}
                className={cn(
                  'rounded-lg px-3 py-2 text-left text-sm transition-all',
                  active
                    ? 'bg-wolf-ice/20 text-wolf-ice font-medium'
                    : 'text-wolf-white/70 hover:bg-wolf-gray/40 hover:text-wolf-white'
                )}
              >
                {genre.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
          Nota mínima
        </h4>
        <div className="flex flex-wrap gap-2">
          {[0, 6, 7, 8, 9].map((val) => (
            <button
              key={val}
              onClick={() => update({ minRating: (filters.minRating ?? 0) === val ? undefined : val })}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                (filters.minRating ?? 0) === val
                  ? 'bg-wolf-ice text-wolf-black'
                  : 'bg-wolf-gray/50 text-wolf-white/70 hover:bg-wolf-gray'
              )}
            >
              {val === 0 ? 'Todas' : `${val}+`}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
