import { useQuery } from '@tanstack/react-query'
import {
  fetchCatalog,
  fetchGenres,
  fetchTitleBySlug,
  fetchPopularTitles,
  fetchLatestUpdates,
  fetchTopRated,
  fetchCompletedTitles,
  fetchOngoingTitles,
  fetchNovels,
  fetchFeaturedTitles,
} from './api'
import type { CatalogFilters } from '@/types/title'

export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export function useCatalog(filters: CatalogFilters) {
  return useQuery({
    queryKey: ['catalog', filters],
    queryFn: () => fetchCatalog(filters),
    placeholderData: (prev) => prev,
  })
}

export function useTitle(slug: string) {
  return useQuery({
    queryKey: ['title', slug],
    queryFn: () => fetchTitleBySlug(slug),
    enabled: !!slug,
  })
}

export function usePopularTitles(limit = 12) {
  return useQuery({
    queryKey: ['titles', 'popular', limit],
    queryFn: () => fetchPopularTitles(limit),
    staleTime: 1000 * 60 * 5,
  })
}

export function useLatestUpdates(limit = 12) {
  return useQuery({
    queryKey: ['titles', 'latest', limit],
    queryFn: () => fetchLatestUpdates(limit),
    staleTime: 1000 * 60 * 2,
  })
}

export function useTopRated(limit = 12) {
  return useQuery({
    queryKey: ['titles', 'top-rated', limit],
    queryFn: () => fetchTopRated(limit),
    staleTime: 1000 * 60 * 10,
  })
}

export function useCompletedTitles(limit = 12) {
  return useQuery({
    queryKey: ['titles', 'completed', limit],
    queryFn: () => fetchCompletedTitles(limit),
    staleTime: 1000 * 60 * 10,
  })
}

export function useOngoingTitles(limit = 12) {
  return useQuery({
    queryKey: ['titles', 'ongoing', limit],
    queryFn: () => fetchOngoingTitles(limit),
    staleTime: 1000 * 60 * 5,
  })
}

export function useNovels(limit = 12) {
  return useQuery({
    queryKey: ['titles', 'novels', limit],
    queryFn: () => fetchNovels(limit),
    staleTime: 1000 * 60 * 10,
  })
}

export function useFeaturedTitles(limit = 5) {
  return useQuery({
    queryKey: ['titles', 'featured', limit],
    queryFn: () => fetchFeaturedTitles(limit),
    staleTime: 1000 * 60 * 5,
  })
}
