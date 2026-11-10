import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchChapterByNumber,
  saveReadingProgress,
  getReadingProgress,
  incrementChapterViews,
} from './api'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'

export function useChapter(titleSlug: string, chapterNumber: number) {
  return useQuery({
    queryKey: ['chapter', titleSlug, chapterNumber],
    queryFn: () => fetchChapterByNumber(titleSlug, chapterNumber),
    enabled: !!titleSlug && !isNaN(chapterNumber),
    staleTime: 1000 * 60 * 5,
  })
}

export function useReadingProgress(chapterId: string | undefined) {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['reading-progress', user?.id, chapterId],
    queryFn: () => {
      if (!user?.id || !chapterId) return null
      return getReadingProgress(user.id, chapterId)
    },
    enabled: !!user?.id && !!chapterId,
    staleTime: 1000 * 30,
  })
}

export function useSaveProgress() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      titleId: string
      chapterId: string
      lastPage: number
      progressPercent: number
    }) => {
      if (!user?.id) return
      await saveReadingProgress({
        userId: user.id,
        ...params,
      })
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['reading-progress', user?.id, variables.chapterId],
      })
    },
  })
}

/** Track chapter view once when chapter loads */
export function useTrackChapterView(chapterId: string | undefined) {
  useEffect(() => {
    if (!chapterId) return
    incrementChapterViews(chapterId)
  }, [chapterId])
}
