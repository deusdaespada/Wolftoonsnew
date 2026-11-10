import { useQuery } from '@tanstack/react-query'
import { fetchRanking } from './api'
import type { RankingType, RankingPeriod } from '@/types/ranking'

export function useRanking(
  type: RankingType,
  period: RankingPeriod = 'all',
  limit = 50
) {
  return useQuery({
    queryKey: ['ranking', type, period, limit],
    queryFn: () => fetchRanking(type, period, limit),
    staleTime: 1000 * 60 * 2,
  })
}
