import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/features/library/hooks'
import { TitleGrid } from '@/components/titles/TitleGrid'
import { Spinner } from '@/components/ui/Spinner'

export function FavoritesPage() {
  const { data: titles, isLoading, error } = useFavorites()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Favoritos</h1>
        <p className="mt-1 text-sm text-wolf-white/50">
          Obras que você marcou como favoritas
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 py-12 text-center text-red-300">
          Erro ao carregar favoritos.
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : !titles || titles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="h-12 w-12 text-wolf-white/20" />
          <p className="mt-4 text-wolf-white/50">Você ainda não favoritou nenhuma obra.</p>
          <Link to="/catalog" className="mt-4 text-sm font-medium text-wolf-ice hover:underline">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <TitleGrid titles={titles} />
      )}
    </div>
  )
}
