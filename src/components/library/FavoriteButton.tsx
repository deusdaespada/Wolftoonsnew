import { Heart } from 'lucide-react'
import { useIsFavorite, useToggleFavorite } from '@/features/library/hooks'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

interface FavoriteButtonProps {
  titleId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function FavoriteButton({ titleId, className, size = 'lg' }: FavoriteButtonProps) {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { data: favorited, isLoading } = useIsFavorite(titleId)
  const toggle = useToggleFavorite()

  if (!user) {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={() => navigate('/login')}
        className={className}
      >
        <Heart className="h-4 w-4" />
        Favoritar
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={() =>
        toggle.mutate({ titleId, currentlyFavorite: !!favorited })
      }
      isLoading={isLoading || toggle.isPending}
      className={cn(favorited && 'text-red-400 hover:text-red-300', className)}
    >
      <Heart className={cn('h-4 w-4', favorited && 'fill-red-400')} />
      {favorited ? 'Favoritado' : 'Favoritar'}
    </Button>
  )
}
