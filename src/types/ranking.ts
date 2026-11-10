import type { TitleListItem } from './title'

export type RankingType =
  | 'popular'
  | 'most_read'
  | 'most_favorited'
  | 'top_rated'
  | 'most_commented'
  | 'recently_updated'
  | 'newest'
  | 'completed'

export type RankingPeriod = 'daily' | 'weekly' | 'monthly' | 'all'

export const RANKING_TYPE_LABELS: Record<RankingType, string> = {
  popular: 'Mais populares',
  most_read: 'Mais lidos',
  most_favorited: 'Mais favoritados',
  top_rated: 'Melhores avaliações',
  most_commented: 'Mais comentados',
  recently_updated: 'Mais atualizados',
  newest: 'Novidades',
  completed: 'Obras concluídas',
}

export const RANKING_PERIOD_LABELS: Record<RankingPeriod, string> = {
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
  all: 'Histórico',
}

export type RankingEntry = TitleListItem & {
  rank: number
  score?: number
}

export type VipPlan = {
  id: string
  name: string
  description: string
  price_label: string
  benefits: string[]
  highlighted?: boolean
}
